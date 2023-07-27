@file:Suppress("unused")

package com.theoplayer.cache

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.theoplayer.util.ViewResolver
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.event.cache.CacheEventTypes
import com.theoplayer.android.api.event.cache.tasklist.CachingTaskListEventTypes

private const val PROP_STATUS = "status"
private const val PROP_TASK = "task"

class CacheModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {
  private val viewResolver: ViewResolver = ViewResolver(context)

  init {
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
      }
      tasks.addEventListener(CachingTaskListEventTypes.REMOVE_TASK) { event ->
        emit("onCacheRemoveTaskEvent", Arguments.createMap().apply {
          putMap(PROP_STATUS, CacheAdapter.fromCachingTask(event.task))
        })
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
}
