package com.theoplayer.broadcast

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.model.ReactModuleInfo
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

@Suppress("unused")
@ReactModule(name = EventBroadcastModule.NAME)
class EventBroadcastModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  companion object {
    const val NAME = "THEORCTEventBroadcastModule"
    val INFO = ReactModuleInfo(
      name = NAME,
      className = NAME,
      canOverrideExistingModule = false,
      needsEagerInit = false,
      isCxxModule = false,
      isTurboModule = false,
    )
  }

  private val viewResolver: ViewResolver = ViewResolver(context)

  override fun getName(): String {
    return NAME
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
