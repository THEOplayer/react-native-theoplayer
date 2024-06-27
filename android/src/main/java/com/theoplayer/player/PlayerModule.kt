package com.theoplayer.player

import com.facebook.react.bridge.*
import com.theoplayer.*
import com.theoplayer.abr.ABRConfigurationAdapter
import com.theoplayer.android.api.player.AspectRatio
import com.theoplayer.android.api.player.PreloadType
import com.theoplayer.android.api.player.PresentationMode
import com.theoplayer.android.api.player.RenderingTarget
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
import com.theoplayer.audio.BackgroundAudioConfigAdapter
import com.theoplayer.presentation.PipConfigAdapter
import com.theoplayer.track.TextTrackStyleAdapter
import com.theoplayer.util.ViewResolver

private const val TAG = "THEORCTPlayerModule"

@Suppress("unused")
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
    if (uid == -1) {
      // Do not allow disabling all audio tracks
      return
    }
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
    if (uid == -1) {
      // Do not allow disabling all video tracks
      return
    }
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let {
        for (track in it.videoTracks) {
          track.isEnabled = track.uid == uid
        }
      }
    }
  }

  /**
   * Check whether a uid is contained in an array of uids.
   */
  private fun containsUid(uid: Int, uids: ReadableArray): Boolean {
    for (q in 0 until uids.size()) {
      if (uids.getInt(q) == uid) {
        return true
      }
    }
    return false
  }

  @ReactMethod
  fun setTargetVideoQuality(tag: Int, uids: ReadableArray) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let {
        // Apply the target quality to the current enabled video track
        for (track in it.videoTracks) {
          // Only consider enabled tracks
          if (!track.isEnabled) {
            continue
          }
          val currentVideoTrack = track as MediaTrack<VideoQuality>
          if (uids.size() == 0) {
            // Reset target qualities when passing empty list.
            currentVideoTrack.setTargetQualities(listOf())
            currentVideoTrack.targetQuality = null
          } else {
            // Filter qualities based on target uids
            currentVideoTrack.qualities?.let { availableQualities ->
              currentVideoTrack.setTargetQualities(availableQualities.filter { quality ->
                containsUid(quality.uid, uids)
              })
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

  @ReactMethod
  fun setPipConfig(tag: Int, config: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.presentationManager?.pipConfig = PipConfigAdapter.fromProps(config)
    }
  }

  @ReactMethod
  fun setBackgroundAudioConfig(tag: Int, config: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.backgroundAudioConfig = BackgroundAudioConfigAdapter.fromProps(config)
    }
  }

  @ReactMethod
  fun setAspectRatio(tag: Int, ratio: String) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.setAspectRatio(when (ratio) {
        "fill" -> AspectRatio.FILL
        "aspectFill" -> AspectRatio.ASPECT_FILL
        else -> AspectRatio.FIT
      })
    }
  }

  @ReactMethod
  fun setKeepScreenOn(tag: Int, value: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.keepScreenOn = value
    }
  }

  @ReactMethod
  fun setTextTrackStyle(tag: Int, style: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        TextTrackStyleAdapter.applyTextTrackStyle(player.textTrackStyle, style)
      }
    }
  }

  @ReactMethod
  fun setRenderingTarget(tag: Int, target: String) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.setRenderingTarget(when (target) {
        "textureView" -> RenderingTarget.TEXTURE_VIEW
        else -> RenderingTarget.SURFACE_VIEW
      })
    }
  }
}
