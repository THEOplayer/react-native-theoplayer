@file:Suppress("unused")

package com.theoplayer.cache

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.theoplayer.util.ViewResolver
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.cache.CachingTask
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.cache.CacheEventTypes
import com.theoplayer.android.api.event.cache.task.CachingTaskErrorEvent
import com.theoplayer.android.api.event.cache.task.CachingTaskEventTypes
import com.theoplayer.android.api.event.cache.task.CachingTaskProgressEvent
import com.theoplayer.android.api.event.cache.task.CachingTaskStateChangeEvent
import com.theoplayer.android.api.event.cache.tasklist.CachingTaskListEventTypes
import com.theoplayer.source.SourceAdapter

private const val TAG = "CacheModule"

private const val PROP_STATUS = "status"
private const val PROP_TASK = "task"
private const val PROP_PROGRESS = "progress"
private const val PROP_ERROR = "error"

class CacheModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {
  private val viewResolver: ViewResolver = ViewResolver(context)
  private val onTaskProgress: EventListener<CachingTaskProgressEvent>
  private val onTaskError: EventListener<CachingTaskErrorEvent>
  private val onTaskStateChange: EventListener<CachingTaskStateChangeEvent>
  private val sourceAdapter = SourceAdapter()

  init {
    onTaskProgress = EventListener<CachingTaskProgressEvent> { event ->
      emit("onCachingTaskProgressEvent", Arguments.createMap().apply {
        putMap(PROP_PROGRESS, CacheAdapter.fromCachingTaskProgress(event.progress))
      })
    }
    onTaskError = EventListener<CachingTaskErrorEvent> { event ->
      emit("onCachingTaskErrorEvent", Arguments.createMap().apply {
        putString(PROP_ERROR, event.error.description)
      })
    }
    onTaskStateChange = EventListener<CachingTaskStateChangeEvent> { event ->
      emit("onCachingTaskStatusChangeEvent", Arguments.createMap().apply {
        putString(PROP_STATUS, CacheAdapter.fromCacheTaskStatus(event.status))
      })
    }

    THEOplayerGlobal.getSharedInstance(context).cache?.apply {
      addEventListener(CacheEventTypes.CACHE_STATE_CHANGE) { event ->
        emit("onCacheStatusChange", Arguments.createMap().apply {
          putString(PROP_STATUS, CacheAdapter.fromCacheStatus(event.status))
        })
      }
      tasks.addEventListener(CachingTaskListEventTypes.ADD_TASK) { event ->
        emit("onCacheAddTaskEvent", Arguments.createMap().apply {
          putMap(PROP_STATUS, CacheAdapter.fromCachingTask(event.task))
        })
        event.task?.addEventListener(CachingTaskEventTypes.CACHING_TASK_PROGRESS, onTaskProgress)
//        event.task?.addEventListener(CachingTaskEventTypes.CACHING_TASK_ERROR, onTaskError)
        event.task?.addEventListener(
          CachingTaskEventTypes.CACHING_TASK_STATE_CHANGE,
          onTaskStateChange
        )
      }
      tasks.addEventListener(CachingTaskListEventTypes.REMOVE_TASK) { event ->
        emit("onCacheRemoveTaskEvent", Arguments.createMap().apply {
          putMap(PROP_STATUS, CacheAdapter.fromCachingTask(event.task))
        })
        event.task?.removeEventListener(CachingTaskEventTypes.CACHING_TASK_PROGRESS, onTaskProgress)
//        event.task?.removeEventListener(CachingTaskEventTypes.CACHING_TASK_ERROR, onTaskError)
        event.task?.removeEventListener(
          CachingTaskEventTypes.CACHING_TASK_STATE_CHANGE,
          onTaskStateChange
        )
      }
    }
  }

  override fun getName(): String {
    return "CastModule"
  }

  private fun emit(
    eventName: String,
    payload: WritableMap
  ) {
    context
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, payload)
  }

  @ReactMethod
  fun createTask(source: ReadableMap, parameters: ReadableMap) {
    val sourceDescription = sourceAdapter.parseSourceFromJS(source)
    if (sourceDescription != null) {
      THEOplayerGlobal.getSharedInstance(context).cache?.createTask(
        sourceDescription,
        CacheAdapter.parseCachingParameters(parameters)
      )
    }
  }

  @ReactMethod
  fun pauseCachingTask(id: String) {
    THEOplayerGlobal.getSharedInstance(context).cache?.tasks?.getTaskById(id)?.pause()
  }

  @ReactMethod
  fun removeCachingTask(id: String) {
    THEOplayerGlobal.getSharedInstance(context).cache?.tasks?.getTaskById(id)?.remove()
  }

  @ReactMethod
  fun startCachingTask(id: String) {
    THEOplayerGlobal.getSharedInstance(context).cache?.tasks?.getTaskById(id)?.start()
  }

  @ReactMethod
  fun renewLicense(id: String, drmConfiguration: ReadableMap?) {
    if (drmConfiguration == null) {
      taskById(id)?.license()?.renew()
    } else {
      // TODO
//      taskById(id)?.license()?.renew(ContentProtectionAdapter.drmConfigurationFromJson(drmConfiguration))
    }
  }

  private fun taskById(id: String): CachingTask? {
    return THEOplayerGlobal.getSharedInstance(context).cache?.tasks?.getTaskById(id) ?: run {
      Log.w(TAG, "CachingTask with id $id not found")
      return null
    }
  }
}
