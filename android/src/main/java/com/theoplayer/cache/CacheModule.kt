@file:Suppress("unused")

package com.theoplayer.cache

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson
import com.theoplayer.specs.CacheModuleSpec
import com.theoplayer.util.ViewResolver
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.cache.Cache
import com.theoplayer.android.api.cache.CachingTask
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.cache.CacheEventTypes
import com.theoplayer.android.api.event.cache.task.CachingTaskErrorEvent
import com.theoplayer.android.api.event.cache.task.CachingTaskEventTypes
import com.theoplayer.android.api.event.cache.task.CachingTaskProgressEvent
import com.theoplayer.android.api.event.cache.task.CachingTaskStateChangeEvent
import com.theoplayer.android.api.event.cache.tasklist.CachingTaskListEventTypes
import com.theoplayer.drm.ContentProtectionAdapter
import com.theoplayer.source.SourceAdapter
import org.json.JSONException
import org.json.JSONObject

private const val PROP_STATUS = "status"
private const val PROP_ID = "id"
private const val PROP_TASK = "task"
private const val PROP_TASKS = "tasks"
private const val PROP_PROGRESS = "progress"
private const val PROP_ERROR = "error"

@ReactModule(name = CacheModule.NAME)
class CacheModule(private val context: ReactApplicationContext) : CacheModuleSpec(context) {
  private val viewResolver: ViewResolver = ViewResolver(context)
  private val onTaskProgress = mutableMapOf<String, EventListener<CachingTaskProgressEvent>>()
  private val onTaskError = mutableMapOf<String, EventListener<CachingTaskErrorEvent>>()
  private val onTaskStateChange = mutableMapOf<String, EventListener<CachingTaskStateChangeEvent>>()
  private val sourceAdapter = SourceAdapter()
  private val cache: Cache
    get() = THEOplayerGlobal.getSharedInstance(context.applicationContext).cache
  private val handler = Handler(Looper.getMainLooper())

  companion object {
    const val NAME = "THEORCTCacheModule"
    const val TAG = "CacheModule"
  }

  init {
    // Add cache event listeners
    handler.post {
      cache.apply {
        // Listen for cache state changes
        addEventListener(CacheEventTypes.CACHE_STATE_CHANGE) { event ->
          emit("onCacheStatusChange", Arguments.createMap().apply {
            putString(PROP_STATUS, CacheAdapter.fromCacheStatus(event.status))
          })
        }
        // Listen for add task events
        tasks.addEventListener(CachingTaskListEventTypes.ADD_TASK) { event ->
          event.task?.let { task ->
            // Notify AddCachingTaskEvent event
            emit("onAddCachingTaskEvent", Arguments.createMap().apply {
              putMap(PROP_TASK, CacheAdapter.fromCachingTask(task))
            })
            // Add CachingTask listeners
            addCachingTaskListeners(task)
          }
        }

        // Listen for task removal
        tasks.addEventListener(CachingTaskListEventTypes.REMOVE_TASK) { event ->
          event.task?.let { task ->
            // Notify RemoveCachingTaskEvent event
            emit("onRemoveCachingTaskEvent", Arguments.createMap().apply {
              putMap(PROP_TASK, CacheAdapter.fromCachingTask(event.task))
            })
            // Remove CachingTask listeners
            removeCachingTaskListeners(task)
          }
        }
      }
    }
  }

  override fun getName(): String {
    return NAME
  }

  private fun addCachingTaskListeners(task: CachingTask) {
    // Listen for task progress
    onTaskProgress[task.id] = EventListener<CachingTaskProgressEvent> { progressEvent ->
      emit("onCachingTaskProgressEvent", Arguments.createMap().apply {
        putString(PROP_ID, task.id)
        putMap(PROP_PROGRESS, CacheAdapter.fromCachingTaskProgress(progressEvent.progress))
      })
    }.also { listener ->
      task.addEventListener(CachingTaskEventTypes.CACHING_TASK_PROGRESS, listener)
    }

    // Listen for task errors
    onTaskError[task.id] = EventListener<CachingTaskErrorEvent> { errorEvent ->
      emit("onCachingTaskErrorEvent", Arguments.createMap().apply {
        putString(PROP_ID, task.id)
        putString(PROP_ERROR, errorEvent.error.description)
      })
    }.also { listener ->
      task.addEventListener(CachingTaskEventTypes.CACHING_TASK_ERROR, listener)
    }

    // Listen for task state changes
    onTaskStateChange[task.id] = EventListener<CachingTaskStateChangeEvent> { changeEvent ->
      emit("onCachingTaskStatusChangeEvent", Arguments.createMap().apply {
        putString(PROP_ID, task.id)
        putString(PROP_STATUS, CacheAdapter.fromCacheTaskStatus(changeEvent.status))
      })
    }.also { listener ->
      task.addEventListener(CachingTaskEventTypes.CACHING_TASK_STATE_CHANGE, listener)
    }
  }

  private fun removeCachingTaskListeners(task: CachingTask) {
    onTaskProgress[task.id]?.apply {
      task.removeEventListener(CachingTaskEventTypes.CACHING_TASK_PROGRESS, this)
    }
    onTaskProgress.remove(task.id)
    onTaskError[task.id]?.apply {
      task.removeEventListener(CachingTaskEventTypes.CACHING_TASK_ERROR, this)
    }
    onTaskError.remove(task.id)
    onTaskStateChange[task.id]?.apply {
      task.removeEventListener(CachingTaskEventTypes.CACHING_TASK_STATE_CHANGE, this)
    }
    onTaskStateChange.remove(task.id)
  }

  private fun emit(
    eventName: String,
    payload: WritableMap
  ) {
    // Make sure we are not emitting before React has been setup.
    if (!context.hasActiveReactInstance()) {
      return
    }

    context
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, payload)
  }

  @ReactMethod
  override fun getInitialState(promise: Promise) {
    handler.post {
      cache.apply {

        // Add listeners to existing tasks
        tasks.forEach { task ->
          addCachingTaskListeners(task)
        }

        promise.resolve(Arguments.createMap().apply {
          putString(PROP_STATUS, CacheAdapter.fromCacheStatus(status))
          putArray(PROP_TASKS, CacheAdapter.fromCachingTaskList(tasks))
        })
      }
    }
  }

  @ReactMethod
  override fun createTask(source: ReadableMap, parameters: ReadableMap) {
    val sourceDescription = sourceAdapter.parseSourceFromJS(source)
    if (sourceDescription != null) {
      handler.post {
        cache.createTask(
          sourceDescription,
          CacheAdapter.parseCachingParameters(parameters)
        )
      }
    }
  }

  @ReactMethod
  override fun pauseCachingTask(id: String) {
    handler.post {
      cache.tasks.getTaskById(id)?.pause()
    }
  }

  @ReactMethod
  override fun removeCachingTask(id: String) {
    handler.post {
      cache.tasks.getTaskById(id)?.remove()
    }
  }

  @ReactMethod
  override fun startCachingTask(id: String) {
    handler.post {
      cache.tasks.getTaskById(id)?.start()
    }
  }

  @ReactMethod
  override fun renewLicense(id: String, drmConfiguration: ReadableMap?) {
    handler.post {
      if (drmConfiguration == null) {
        taskById(id)?.license()?.renew()
      } else {
        try {
          val drmConfigurationJson = JSONObject(Gson().toJson(drmConfiguration.toHashMap()))
          taskById(id)?.license()
            ?.renew(ContentProtectionAdapter.drmConfigurationFromJson(drmConfigurationJson))
        } catch (e: JSONException) {
          e.printStackTrace()
        }
      }
    }
  }

  @ReactMethod
  @Suppress("UNUSED_PARAMETER")
  fun addListener(eventName: String?) {
  }

  @ReactMethod
  @Suppress("UNUSED_PARAMETER")
  fun removeListeners(count: Int?) {
  }

  private fun taskById(id: String): CachingTask? {
    return cache.tasks.getTaskById(id) ?: run {
      Log.w(TAG, "CachingTask with id $id not found")
      return null
    }
  }
}
