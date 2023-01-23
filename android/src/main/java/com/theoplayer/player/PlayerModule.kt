package com.theoplayer.player

import com.facebook.react.bridge.*
import com.theoplayer.*
import com.theoplayer.util.ViewResolver

private const val TAG = "PlayerModule"

class PlayerModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val viewResolver: ViewResolver

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun setABRConfig(tag: Int, config: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setABRConfig(config)
    }
  }

  @ReactMethod
  fun setSource(tag: Int, src: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setSource(src)
    }
  }

  @ReactMethod
  fun setCurrentTime(tag: Int, time: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.seekTo(time)
    }
  }

  @ReactMethod
  fun setPaused(tag: Int, paused: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setPaused(paused)
    }
  }

  @ReactMethod
  fun setMuted(tag: Int, muted: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setMuted(muted)
    }
  }

  @ReactMethod
  fun setVolume(tag: Int, volume: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setVolume(volume)
    }
  }

  @ReactMethod
  fun setPlaybackRate(tag: Int, playbackRate: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setPlaybackRate(playbackRate)
    }
  }

  @ReactMethod
  fun setFullscreen(tag: Int, fullscreen: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setFullscreen(fullscreen)
    }
  }

  @ReactMethod
  fun setSelectedTextTrack(tag: Int, uid: Int) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setSelectedTextTrack(uid)
    }
  }

  @ReactMethod
  fun setSelectedAudioTrack(tag: Int, uid: Int) {
    if (uid != -1) {
      viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
        view?.setSelectedAudioTrack(uid)
      }
    }
  }

  @ReactMethod
  fun setSelectedVideoTrack(tag: Int, uid: Int) {
    if (uid != -1) {
      viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
        view?.setSelectedVideoTrack(uid)
      }
    }
  }

  @ReactMethod
  fun setTargetVideoQuality(tag: Int, uid: ReadableArray) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setTargetVideoQualities(uid)
    }
  }
}
