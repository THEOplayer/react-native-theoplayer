package com.theoplayer.player

import com.facebook.react.bridge.*
import com.theoplayer.*
import com.theoplayer.android.api.player.PreloadType
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
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
      view?.player?.let {
        for (track in it.textTracks) {
          if (track.uid == uid) {
            track.mode = TextTrackMode.SHOWING
          } else if (track.mode == TextTrackMode.SHOWING) {
            track.mode = TextTrackMode.DISABLED
          }
        }
      }
    }
  }

  @ReactMethod
  fun setSelectedAudioTrack(tag: Int, uid: Int) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let {
        for (track in it.audioTracks) {
          track.isEnabled = track.uid == uid
        }
      }
    }
  }

  @ReactMethod
  fun setSelectedVideoTrack(tag: Int, uid: Int) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let {
        for (track in it.videoTracks) {
          track.isEnabled = track.uid == uid
        }
      }
    }
  }

  @ReactMethod
  fun setTargetVideoQuality(tag: Int, uid: ReadableArray) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setTargetVideoQualities(uid)
    }
  }

  @ReactMethod
  fun setPreload(tag: Int, type: String?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setPreload(when (type) {
        "auto" -> PreloadType.AUTO
        "metadata" -> PreloadType.METADATA
        else -> PreloadType.NONE
      })
    }
  }
}
