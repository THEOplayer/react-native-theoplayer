package com.theoplayer.player

import android.os.Build
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.theoplayer.*
import com.theoplayer.abr.ABRConfigurationAdapter
import com.theoplayer.android.api.player.AspectRatio
import com.theoplayer.android.api.player.PreloadType
import com.theoplayer.android.api.player.PresentationMode
import com.theoplayer.android.api.player.RenderingTarget
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.audio.BackgroundAudioConfigAdapter
import com.theoplayer.presentation.PipConfigAdapter
import com.theoplayer.specs.PlayerModuleSpec
import com.theoplayer.track.TextTrackStyleAdapter
import com.theoplayer.util.ViewResolver

@Suppress("unused")
@ReactModule(name = PlayerModule.NAME)
class PlayerModule(context: ReactApplicationContext) : PlayerModuleSpec(context) {
  private val viewResolver: ViewResolver = ViewResolver(context)

  companion object {
    const val NAME = "THEORCTPlayerModule"
  }

  override fun getName(): String {
    return NAME
  }

  // The native version string of the Android THEOplayer SDK.
  @ReactMethod
  override fun version(promise: Promise) {
    promise.resolve(THEOplayerGlobal.getVersion())
  }

  @ReactMethod
  override fun setABRConfig(tag: Double, config: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      ABRConfigurationAdapter.applyABRConfigurationFromProps(view?.player, config)
    }
  }

  @ReactMethod
  override fun setSource(tag: Double, src: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.setSource(src)
    }
  }

  @ReactMethod
  override fun setCurrentTime(tag: Double, time: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.currentTime = 1e-03 * time
    }
  }

  @ReactMethod
  override fun setPaused(tag: Double, paused: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      if (paused) {
        view?.player?.pause()
      } else {
        view?.player?.play()
      }
    }
  }

  @ReactMethod
  override fun setAutoplay(tag: Double, autoplay: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.isAutoplay = autoplay
    }
  }

  @ReactMethod
  override fun setMuted(tag: Double, muted: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.isMuted = muted
    }
  }

  @ReactMethod
  override fun setVolume(tag: Double, volume: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.volume = volume
    }
  }

  @ReactMethod
  override fun setPlaybackRate(tag: Double, playbackRate: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.playbackRate = playbackRate
    }
  }

  @ReactMethod
  override fun setSelectedTextTrack(tag: Double, uid: Double?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let {
        for (track in it.textTracks) {
          if (track.uid == uid?.toInt()) {
            track.mode = TextTrackMode.SHOWING
          } else if (track.mode == TextTrackMode.SHOWING) {
            track.mode = TextTrackMode.DISABLED
          }
        }
      }
    }
  }

  @ReactMethod
  override fun setSelectedAudioTrack(tag: Double, uid: Double?) {
    if (uid == null || uid.toInt() == -1) {
      // Do not allow disabling all audio tracks
      return
    }
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let {
        for (track in it.audioTracks) {
          track.isEnabled = track.uid == uid.toInt()
        }
      }
    }
  }

  @ReactMethod
  override fun setSelectedVideoTrack(tag: Double, uid: Double?) {
    if (uid == null || uid.toInt() == -1) {
      // Do not allow disabling all video tracks
      return
    }
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let {
        for (track in it.videoTracks) {
          track.isEnabled = track.uid == uid.toInt()
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
  override fun setTargetVideoQuality(tag: Double, uids: ReadableArray) {
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
  override fun setPreload(tag: Double, type: String?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.preload = when (type) {
        "auto" -> PreloadType.AUTO
        "metadata" -> PreloadType.METADATA
        else -> PreloadType.NONE
      }
    }
  }

  @ReactMethod
  override fun setPresentationMode(tag: Double, type: String?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.presentationManager?.setPresentation(
        when (type) {
          "picture-in-picture" -> PresentationMode.PICTURE_IN_PICTURE
          "fullscreen" -> PresentationMode.FULLSCREEN
          else -> PresentationMode.INLINE
        }
      )
    }
  }

  @ReactMethod
  override fun setPipConfig(tag: Double, config: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.presentationManager?.pipConfig = PipConfigAdapter.fromProps(config)
    }
  }

  @ReactMethod
  override fun setBackgroundAudioConfig(tag: Double, config: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.backgroundAudioConfig = BackgroundAudioConfigAdapter.fromProps(config)
    }
  }

  @ReactMethod
  override fun setAspectRatio(tag: Double, ratio: String) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.setAspectRatio(
        when (ratio) {
          "fill" -> AspectRatio.FILL
          "aspectFill" -> AspectRatio.ASPECT_FILL
          else -> AspectRatio.FIT
        }
      )
    }
  }

  @ReactMethod
  override fun setKeepScreenOn(tag: Double, value: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.keepScreenOn = value
    }
  }

  @ReactMethod
  override fun setTextTrackStyle(tag: Double, style: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        TextTrackStyleAdapter.applyTextTrackStyle(player.textTrackStyle, style)
      }
    }
  }

  @ReactMethod
  override fun setRenderingTarget(tag: Double, target: String) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.setRenderingTarget(
        when (target) {
          "textureView" -> RenderingTarget.TEXTURE_VIEW
          else -> {
            // Prefer SURFACE_CONTROL
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
              RenderingTarget.SURFACE_CONTROL
            } else {
              RenderingTarget.SURFACE_VIEW
            }
          }
        }
      )
    }
  }
}
