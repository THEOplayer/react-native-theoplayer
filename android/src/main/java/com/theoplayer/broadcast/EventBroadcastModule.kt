@file:Suppress("unused")
package com.theoplayer.broadcast

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.theoplayer.specs.EventBroadcastModuleSpec
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

@ReactModule(name = EventBroadcastModule.NAME)
class EventBroadcastModule(context: ReactApplicationContext) : EventBroadcastModuleSpec(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)

  companion object {
    const val NAME = "THEORCTEventBroadcastModule"
  }

  override fun getName(): String {
    return NAME
  }

  /**
   * Receive a react-native broadcast event and route it to the player's broadcast adapter.
   */
  @ReactMethod
  override fun broadcastEvent(tag: Double, event: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.broadcast?.broadcastEvent(event)
    }
  }
}
