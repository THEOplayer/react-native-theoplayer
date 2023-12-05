package com.theoplayer.broadcast

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.event.Event
import com.theoplayer.util.ViewResolver
import java.lang.Exception

private const val TAG = "EventBroadcastModule"

@ReactModule(name = TAG)
class EventBroadcastModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun broadcastEvent(tag: Int, event: ReadableMap) {
    // Map target names to native modules.
    val modules = reactApplicationContext.nativeModules

    // No modules to forward to.
    if (modules.isEmpty()) {
      return
    }

    // Route the event to each module
    EventAdapter.parseEvent(event)?.also {
      modules.forEach { module ->
        broadcastEvent(tag, module, it)
      }
    }
  }

  fun broadcastEvent(tag: Int, target: NativeModule, event: Event<*>) {
    try {
      (target as? EventBroadcastReceiver)?.onEventBroadcasted(tag, event)
    } catch (e: Exception) {
      // Module does not accept event.
    }
  }
}
