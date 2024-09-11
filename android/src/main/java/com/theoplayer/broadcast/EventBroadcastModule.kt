@file:Suppress("unused")
package com.theoplayer.broadcast

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "THEORCTEventBroadcastModule"

@ReactModule(name = TAG)
class EventBroadcastModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)

  override fun getName(): String {
    return TAG
  }

  /**
   * Receive a react-native broadcast event and route it to the player's broadcast adapter.
   */
  @ReactMethod
  fun broadcastEvent(tag: Int, event: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.broadcast?.broadcastEvent(event)
    }
  }
}
