package com.theoplayer.media

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val PROP_TAG = "tag"
private const val PROP_ACTION = "action"

enum class MediaControlAction(val propName: String) {
  PLAY("play"),
  PAUSE("pause"),
  SKIP_TO_NEXT("skipToNext"),
  SKIP_TO_PREVIOUS("skipToPrevious");

  companion object {
    private val map = entries.associateBy(MediaControlAction::propName)
    fun fromPropName(propName: String): MediaControlAction? = map[propName]
  }
}

@Suppress("unused")
@ReactModule(name = MediaControlModule.NAME)
class MediaControlModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  companion object {
    const val NAME = "THEORCTMediaControlModule"
    val INFO = ReactModuleInfo(
      name = NAME,
      className = NAME,
      canOverrideExistingModule = false,
      needsEagerInit = false,
      isCxxModule = false,
      isTurboModule = false,
    )
    const val MEDIA_CONTROL_EVENT = "MediaControlEvent"
  }

  private val viewResolver: ViewResolver = ViewResolver(context)

  override fun getName(): String {
    return NAME
  }

  override fun getConstants(): Map<String, Any> {
    return mapOf("MEDIA_CONTROL_EVENT" to MEDIA_CONTROL_EVENT)
  }

  /**
   * Register a handler for a media control action. Instead of storing the Callback, use event emitter for multiple notifications.
   * When the action occurs, call sendEvent to notify JS listeners.
   */
  @ReactMethod
  fun setHandler(tag: Int, action: String) {
    val mediaControlAction = MediaControlAction.fromPropName(action)
    if (mediaControlAction != null) {
      viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
        view?.playerContext?.mediaControlProxy?.setHandler(mediaControlAction, {
          sendEvent(MEDIA_CONTROL_EVENT, Arguments.createMap().apply {
            putInt(PROP_TAG, tag)
            putString(PROP_ACTION, action)
          })
        })
      }
    }
  }

  private fun sendEvent(eventName: String, params: WritableMap?) {
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }
}
