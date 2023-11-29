package com.theoplayer.track

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.event.track.texttrack.TextTrackEventTypes
import com.theoplayer.android.api.player.track.texttrack.TextTrack
import com.theoplayer.android.api.player.track.texttrack.TextTrackList
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
import com.theoplayer.util.ViewResolver

class TextTrackModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val viewResolver: ViewResolver = ViewResolver(context)

  override fun getName(): String {
    return "TextTrackModule"
  }

  @ReactMethod
  fun setTimeOffset(tag: Int, uid: Int, time: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.textTracks?.let {
        textTrackByUid(it, uid)?.addEventListener(TextTrackEventTypes.ADDCUE, { event ->
          // TODO
//          event.cue.startTime += 1e-3 * time
//          event.cue.endTime += 1e-3 * time
        })
      }
    }
  }

  @ReactMethod
  fun setMaxCueDuration(tag: Int, uid: Int, time: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.textTracks?.let {
        textTrackByUid(it, uid)?.addEventListener(TextTrackEventTypes.ADDCUE, { event ->
          // TODO
        })
      }
    }
  }

  @ReactMethod
  fun setMode(tag: Int, uid: Int, mode: String) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.textTracks?.let {
        textTrackByUid(it, uid)?.mode = when (mode) {
          "hidden" -> TextTrackMode.HIDDEN
          "showing" -> TextTrackMode.SHOWING
          else -> TextTrackMode.DISABLED
        }
      }
    }
  }

  private fun textTrackByUid(trackList: TextTrackList, uid: Int): TextTrack? {
    for (track in trackList) {
      if (track.uid == uid) {
        return track
      }
    }
    return null
  }
}
