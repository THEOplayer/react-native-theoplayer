@file:Suppress("unused")

package com.theoplayer

import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder

private const val REACT_CLASS = "THEOplayerRCTView"

private const val PROP_CONFIG = "config"
private const val PROP_ABR_CONFIG = "abrConfig"
private const val PROP_SRC = "src"
private const val PROP_SEEK = "seek"
private const val PROP_PAUSED = "paused"
private const val PROP_MUTED = "muted"
private const val PROP_VOLUME = "volume"
private const val PROP_PLAYBACKRATE = "playbackRate"
private const val PROP_FULLSCREEN = "fullscreen"
private const val PROP_SELECTED_TEXTTRACK = "selectedTextTrack"
private const val PROP_SELECTED_AUDIOTRACK = "selectedAudioTrack"
private const val PROP_SELECTED_VIDEOTRACK = "selectedVideoTrack"
private const val PROP_TARGET_VIDEOQUALITY = "targetVideoQuality"

class ReactTHEOplayerViewManager : ViewGroupManager<ReactTHEOplayerView>() {
  override fun getName(): String {
    return REACT_CLASS
  }

  override fun createViewInstance(reactContext: ThemedReactContext): ReactTHEOplayerView {
    return ReactTHEOplayerView(reactContext)
  }

  override fun onDropViewInstance(view: ReactTHEOplayerView) {
    view.cleanUpResources()
  }

  @ReactProp(name = PROP_CONFIG)
  fun setConfig(videoView: ReactTHEOplayerView, config: ReadableMap?) {
    videoView.initialize(config)
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
    val builder = MapBuilder.builder<String, Any>()
    for (event in PlayerEventEmitter.Events) {
      builder.put(event, MapBuilder.of("registrationName", event))
    }
    return builder.build()
  }
}
