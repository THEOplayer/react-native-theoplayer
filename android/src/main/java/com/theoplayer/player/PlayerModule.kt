package com.theoplayer.player

import com.facebook.react.bridge.*
import com.theoplayer.*
import com.theoplayer.abr.ABRConfigurationAdapter
import com.theoplayer.android.api.player.PreloadType
import com.theoplayer.android.api.player.PresentationMode
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
import com.theoplayer.track.QualityListFilter
import com.theoplayer.track.emptyQualityList
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
      ABRConfigurationAdapter.applyABRConfigurationFromProps(view?.player, config)
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
      view?.player?.currentTime = 1e-03 * time
    }
  }

  @ReactMethod
  fun setPaused(tag: Int, paused: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      if (paused) {
        view?.player?.pause()
      } else {
        view?.player?.play()
      }
    }
  }

  @ReactMethod
  fun setMuted(tag: Int, muted: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.isMuted = muted
    }
  }

  @ReactMethod
  fun setVolume(tag: Int, volume: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.volume = volume
    }
  }

  @ReactMethod
  fun setPlaybackRate(tag: Int, playbackRate: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.playbackRate = playbackRate
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
  fun setTargetVideoQuality(tag: Int, uids: ReadableArray) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let {
        // Apply the target quality to the current enabled video track
        for (track in it.videoTracks) {
          if (track.isEnabled) {
            val currentVideoTrack = track as MediaTrack<VideoQuality>
            if (uids.size() == 0) {
              // Reset target qualities when passing empty list.
              currentVideoTrack.targetQualities = emptyQualityList()
              currentVideoTrack.targetQuality = null
            } else {
              currentVideoTrack.qualities?.let { qualities ->
                currentVideoTrack.targetQualities = QualityListFilter(qualities).filterQualityList(uids)
              }
            }
          }
        }
      }
    }
  }

  @ReactMethod
  fun setPreload(tag: Int, type: String?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.preload = when (type) {
        "auto" -> PreloadType.AUTO
        "metadata" -> PreloadType.METADATA
        else -> PreloadType.NONE
      }
    }
  }

  @ReactMethod
  fun setPresentationMode(tag: Int, type: String?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.presentationManager?.setPresentation(when (type) {
        "picture-in-picture" -> PresentationMode.PICTURE_IN_PICTURE
        "fullscreen" -> PresentationMode.FULLSCREEN
        else -> PresentationMode.INLINE
      })
    }
  }
}
