package com.theoplayer.util

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.player.PresentationMode
import com.theoplayer.android.api.player.ReadyState
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack
import com.theoplayer.android.api.player.track.mediatrack.MediaTrackList
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality
import com.theoplayer.android.api.player.track.mediatrack.quality.Quality
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality
import com.theoplayer.android.api.player.track.texttrack.TextTrack
import com.theoplayer.android.api.player.track.texttrack.TextTrackList
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCue
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.api.timerange.TimeRanges
import com.theoplayer.presentation.PresentationModeChangeContext
import com.theoplayer.presentation.PresentationModeChangePipContext
import com.theoplayer.track.MediaTrackType
import com.theoplayer.track.TrackListAdapter
import java.util.*

private const val EVENT_PROP_SOURCE = "source"
private const val EVENT_PROP_CURRENT_TIME = "currentTime"
private const val EVENT_PROP_PRESENTATION_MODE = "presentationMode"
private const val EVENT_PROP_PREV_PRESENTATION_MODE = "previousPresentationMode"
private const val EVENT_PROP_CONTEXT = "context"
private const val EVENT_PROP_PIP = "pip"
private const val EVENT_PROP_CURRENT_PROGRAM_DATE_TIME = "currentProgramDateTime"
private const val EVENT_PROP_SEEKABLE = "seekable"
private const val EVENT_PROP_BUFFERED = "buffered"
private const val EVENT_PROP_START = "start"
private const val EVENT_PROP_END = "end"
private const val EVENT_PROP_PAUSED = "paused"
private const val EVENT_PROP_DURATION = "duration"
private const val EVENT_PROP_TEXT_TRACKS = "textTracks"
private const val EVENT_PROP_AUDIO_TRACKS = "audioTracks"
private const val EVENT_PROP_VIDEO_TRACKS = "videoTracks"
private const val EVENT_PROP_SELECTED_TEXT_TRACK = "selectedTextTrack"
private const val EVENT_PROP_SELECTED_AUDIO_TRACK = "selectedAudioTrack"
private const val EVENT_PROP_SELECTED_VIDEO_TRACK = "selectedVideoTrack"
private const val EVENT_PROP_ERROR = "error"
private const val EVENT_PROP_ERROR_CODE = "errorCode"
private const val EVENT_PROP_ERROR_MESSAGE = "errorMessage"
private const val EVENT_PROP_RATE = "playbackRate"
private const val EVENT_PROP_READYSTATE = "readyState"
private const val EVENT_PROP_RETRYCOUNT = "retryCount"
private const val EVENT_PROP_SEGMENTSTARTTIME = "segmentStartTime"
private const val EVENT_PROP_TRACK = "track"
private const val EVENT_PROP_TRACK_UID = "trackUid"
private const val EVENT_PROP_TRACK_TYPE = "trackType"
private const val EVENT_PROP_CUE = "cue"
private const val EVENT_PROP_QUALITIES = "qualities"
private const val EVENT_PROP_VOLUME = "volume"
private const val EVENT_PROP_MUTED = "muted"

class PayloadBuilder {
  private val payload: WritableMap = Arguments.createMap()

  fun source(source: SourceDescription?) = apply {
    if (source != null) {
      val sourcePayload = Arguments.createMap()
      // TODO: fill in source properties
      payload.putMap(EVENT_PROP_SOURCE, sourcePayload)
    }
  }

  fun currentTime(timeInSec: Double) = apply {
    payload.putDouble(EVENT_PROP_CURRENT_TIME, (1e03 * timeInSec).toLong().toDouble())
  }

  fun currentProgramDateTime(currentProgramDateTime: Date?) = apply {
    currentProgramDateTime?.let {
      payload.putDouble(
        EVENT_PROP_CURRENT_PROGRAM_DATE_TIME,
        // Date.time is already formatted in msecs.
        currentProgramDateTime.time.toDouble()
      )
    }
  }

  fun presentationMode(presentationMode: PresentationMode, prevPresentationMode: PresentationMode?, context: PresentationModeChangeContext?) =
    apply {
      payload.putString(
        EVENT_PROP_PRESENTATION_MODE,
        presentationModeToString(presentationMode)
      )
      payload.putString(
        EVENT_PROP_PREV_PRESENTATION_MODE,
        presentationModeToString(prevPresentationMode ?: PresentationMode.INLINE)
      )
      if (context != null) {
        presentationModeChangedContext(context)
      }
    }

  private fun presentationModeToString(presentationMode: PresentationMode): String {
    return when (presentationMode) {
      PresentationMode.PICTURE_IN_PICTURE -> "picture-in-picture"
      PresentationMode.FULLSCREEN -> "fullscreen"
      else -> "inline"
    }
  }

  private fun presentationModeChangedContext(context: PresentationModeChangeContext) = apply {
    val contextPayload = Arguments.createMap()
    context.pip?.let { pipCtx ->
      contextPayload.putString(EVENT_PROP_PIP, when (pipCtx) {
        PresentationModeChangePipContext.RESTORED -> "restored"
        else -> "closed"
      })
    }
    payload.putMap(EVENT_PROP_CONTEXT, contextPayload)
  }

  fun paused(paused: Boolean) = apply {
    payload.putBoolean(EVENT_PROP_PAUSED, paused)
  }

  fun playbackRate(playbackRate: Double) = apply {
    payload.putDouble(EVENT_PROP_RATE, playbackRate)
  }

  fun duration(durationInSec: Double) = apply {
    payload.putDouble(EVENT_PROP_DURATION, TypeUtils.encodeInfNan(1e03 * durationInSec))
  }

  fun volume(volume: Double, muted: Boolean) = apply {
    payload.putDouble(EVENT_PROP_VOLUME, volume)
    payload.putBoolean(EVENT_PROP_MUTED, muted)
  }

  fun seekable(ranges: TimeRanges?) = apply {
    payload.putArray(EVENT_PROP_SEEKABLE, fromTimeRanges(ranges))
  }

  fun buffered(ranges: TimeRanges?) = apply {
    payload.putArray(EVENT_PROP_BUFFERED, fromTimeRanges(ranges))
  }

  fun error(message: String?) = apply {
    val error = Arguments.createMap()
    error.putString(EVENT_PROP_ERROR_MESSAGE, message ?: "")
    payload.putMap(EVENT_PROP_ERROR, error)
  }

  fun error(code: String, message: String?) = apply {
    val error = Arguments.createMap()
    error.putString(EVENT_PROP_ERROR_CODE, code)
    error.putString(EVENT_PROP_ERROR_MESSAGE, message ?: "")
    payload.putMap(EVENT_PROP_ERROR, error)
  }

  fun readyState(readyState: ReadyState) = apply {
    payload.putInt(EVENT_PROP_READYSTATE, readyState.ordinal)
  }

  fun textTracks(textTrackList: TextTrackList?) = apply {
    payload.putArray(
      EVENT_PROP_TEXT_TRACKS,
      TrackListAdapter.fromTextTrackList(textTrackList)
    )
  }

  fun audioTracks(audioTrackList: MediaTrackList<AudioQuality>?) = apply {
    payload.putArray(
      EVENT_PROP_AUDIO_TRACKS,
      TrackListAdapter.fromAudioTrackList(audioTrackList)
    )
  }

  fun videoTracks(videoTrackList: MediaTrackList<VideoQuality>?) = apply {
    payload.putArray(
      EVENT_PROP_VIDEO_TRACKS,
      TrackListAdapter.fromVideoTrackList(videoTrackList)
    )
  }

  fun selectedTextTrack(selectedTextTrack: TextTrack?) = apply {
    selectedTextTrack?.let {
      payload.putInt(EVENT_PROP_SELECTED_TEXT_TRACK, selectedTextTrack.uid)
    }
  }

  fun selectedAudioTrack(selectedAudioTrack: MediaTrack<AudioQuality>?) = apply {
    selectedAudioTrack?.let {
      payload.putInt(EVENT_PROP_SELECTED_AUDIO_TRACK, selectedAudioTrack.uid)
    }
  }

  fun selectedVideoTrack(selectedVideoTrack: MediaTrack<VideoQuality>?) = apply {
    selectedVideoTrack?.let {
      payload.putInt(EVENT_PROP_SELECTED_VIDEO_TRACK, selectedVideoTrack.uid)
    }
  }

  fun segmentNotFound(segmentStartTime: Double, error: String, retryCount: Int) = apply {
    payload.putDouble(EVENT_PROP_SEGMENTSTARTTIME, 1e03 * segmentStartTime)
    payload.putString(EVENT_PROP_ERROR, error)
    payload.putInt(EVENT_PROP_RETRYCOUNT, retryCount)
  }

  fun textTrack(textTrack: TextTrack) = apply {
    payload.putMap(EVENT_PROP_TRACK, TrackListAdapter.fromTextTrack(textTrack))
  }

  fun textTrackCue(cue: TextTrackCue, textTrack: TextTrack?) = apply {
    textTrack?.let {
      payload.putInt(EVENT_PROP_TRACK_UID, textTrack.uid)
    }
    payload.putMap(EVENT_PROP_CUE, TrackListAdapter.fromTextTrackCue(cue))
  }

  fun mediaTrack(trackType: MediaTrackType, track: MediaTrack<*>) = apply {
    payload.putInt(EVENT_PROP_TRACK_TYPE, trackType.type)
    payload.putMap(EVENT_PROP_TRACK, TrackListAdapter.fromMediaTrack(track, trackType))
  }

  fun mediaTrackQualities(quality: Quality, activeTrack: MediaTrack<*>?) = apply {
    val trackType = if (quality is AudioQuality) MediaTrackType.AUDIO else MediaTrackType.VIDEO
    payload.putInt(EVENT_PROP_TRACK_TYPE, trackType.type)
    if (activeTrack != null) {
      payload.putInt(EVENT_PROP_TRACK_UID, activeTrack.uid)
    }
    payload.putMap(EVENT_PROP_QUALITIES, TrackListAdapter.fromQuality(quality))
  }

  fun build(): WritableMap {
    return payload
  }
}

fun fromTimeRanges(timeRanges: TimeRanges?): WritableArray {
  val payload = Arguments.createArray()
  timeRanges?.forEach { timeRange ->
    val range = Arguments.createMap()
    range.putDouble(EVENT_PROP_START, 1e03 * timeRange.start)
    range.putDouble(EVENT_PROP_END, 1e03 * timeRange.end)
    payload.pushMap(range)
  }
  return payload
}
