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
private const val PROP_VIDEO_ASPECT_RATIO = "videoAspectRatio"
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

  @ReactProp(name = PROP_ABR_CONFIG)
  fun setABRConfig(videoView: ReactTHEOplayerView, config: ReadableMap?) {
    videoView.setABRConfig(config)
  }

  @ReactProp(name = PROP_SRC)
  fun setSource(videoView: ReactTHEOplayerView, src: ReadableMap?) {
    videoView.setSource(src)
  }

  @ReactProp(name = PROP_SEEK)
  fun setSeek(videoView: ReactTHEOplayerView, seek: Double) {
    videoView.seekTo(seek)
  }

  @ReactProp(name = PROP_PAUSED, defaultBoolean = false)
  fun setPaused(videoView: ReactTHEOplayerView, paused: Boolean) {
    videoView.setPaused(paused)
  }

  @ReactProp(name = PROP_MUTED, defaultBoolean = false)
  fun setMuted(videoView: ReactTHEOplayerView, muted: Boolean) {
    videoView.setMuted(muted)
  }

  @ReactProp(name = PROP_VOLUME, defaultDouble = 1.0)
  fun setVolume(videoView: ReactTHEOplayerView, volume: Double) {
    videoView.setVolume(volume)
  }

  @ReactProp(name = PROP_PLAYBACKRATE, defaultDouble = 1.0)
  fun setPlaybackRate(videoView: ReactTHEOplayerView, playbackRate: Double) {
    videoView.setPlaybackRate(playbackRate)
  }

  @ReactProp(name = PROP_FULLSCREEN, defaultBoolean = false)
  fun setFullscreen(videoView: ReactTHEOplayerView, fullscreen: Boolean) {
    videoView.setFullscreen(fullscreen)
  }

  @ReactProp(name = PROP_VIDEO_ASPECT_RATIO)
  fun setVideoAspectRatio(videoView: ReactTHEOplayerView, videoAspectRatio: String?) {
    videoView.setAspectRatio(videoAspectRatio)
  }

  @ReactProp(name = PROP_SELECTED_TEXTTRACK, defaultInt = -1)
  fun setSelectedTextTrack(videoView: ReactTHEOplayerView, uid: Int) {
    videoView.setSelectedTextTrack(uid)
  }

  @ReactProp(name = PROP_SELECTED_AUDIOTRACK, defaultInt = -1)
  fun setSelectedAudioTrack(videoView: ReactTHEOplayerView, uid: Int) {
    if (uid != -1) {
      videoView.setSelectedAudioTrack(uid)
    }
  }

  @ReactProp(name = PROP_SELECTED_VIDEOTRACK, defaultInt = -1)
  fun setSelectedVideoTrack(videoView: ReactTHEOplayerView, uid: Int) {
    if (uid != -1) {
      videoView.setSelectedVideoTrack(uid)
    }
  }

  @ReactProp(name = PROP_TARGET_VIDEOQUALITY)
  fun setTargetVideoQuality(videoView: ReactTHEOplayerView, uid: ReadableArray) {
    videoView.setTargetVideoQualities(uid)
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
    val builder = MapBuilder.builder<String, Any>()
    for (event in PlayerEventEmitter.Events) {
      builder.put(event, MapBuilder.of("registrationName", event))
    }
    return builder.build()
  }
}
