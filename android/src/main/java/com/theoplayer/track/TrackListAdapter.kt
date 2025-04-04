package com.theoplayer.track

import com.facebook.react.bridge.Arguments
import com.theoplayer.android.api.player.track.texttrack.TextTrackList
import com.facebook.react.bridge.WritableArray
import com.theoplayer.android.api.player.track.texttrack.TextTrack
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCue
import com.theoplayer.android.api.player.track.mediatrack.quality.Quality
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality
import com.theoplayer.android.api.player.track.mediatrack.MediaTrackList
import com.theoplayer.android.api.player.track.texttrack.cue.DateRangeCue
import com.theoplayer.util.TypeUtils

private const val PROP_ID = "id"
private const val PROP_UID = "uid"
private const val PROP_KIND = "kind"
private const val PROP_LANGUAGE = "language"
private const val PROP_MODE = "mode"
private const val PROP_LABEL = "label"
private const val PROP_TYPE = "type"
private const val PROP_CODECS = "codecs"
private const val PROP_NAME = "name"
private const val PROP_ENABLED = "enabled"
private const val PROP_SRC = "src"
private const val PROP_FORCED = "forced"
private const val PROP_AUDIO_SAMPLING_RATE = "audioSamplingRate"
private const val PROP_BANDWIDTH = "bandwidth"
private const val PROP_QUALITIES = "qualities"
private const val PROP_ACTIVE_QUALITY = "activeQuality"
private const val PROP_WIDTH = "width"
private const val PROP_HEIGHT = "height"
private const val PROP_FRAMERATE = "frameRate"
private const val PROP_STARTTIME = "startTime"
private const val PROP_ENDTIME = "endTime"
private const val PROP_CUES = "cues"
private const val PROP_CUE_CONTENT = "content"
private const val PROP_ATTRIBUTE_CLASS = "class"
private const val PROP_STARTDATE = "startDate"
private const val PROP_ENDDATE = "endDate"
private const val PROP_DURATION = "duration"
private const val PROP_PLANNED_DURATION = "plannedDuration"
private const val PROP_END_ON_NEXT = "endOnNext"
private const val PROP_SCTE35CMD = "scte35Cmd"
private const val PROP_SCTE35OUT = "scte35Out"
private const val PROP_SCTE35IN = "scte35In"
private const val PROP_CUSTOM_ATTRIBUTES = "customAttributes"

object TrackListAdapter {

  fun fromTextTrackList(textTrackList: TextTrackList?): WritableArray {
    val textTracks = Arguments.createArray()
    textTrackList?.forEach { track ->
      textTracks.pushMap(fromTextTrack(track))
    }
    return textTracks
  }

  fun fromTextTrack(textTrack: TextTrack): WritableMap {
    val textTrackPayload = Arguments.createMap()
    textTrackPayload.putString(PROP_ID, textTrack.id)
    textTrackPayload.putInt(PROP_UID, textTrack.uid)
    textTrackPayload.putString(PROP_KIND, textTrack.kind)
    textTrackPayload.putString(PROP_LANGUAGE, textTrack.language)
    textTrackPayload.putString(PROP_MODE, textTrack.mode.mode)
    textTrackPayload.putString(PROP_LABEL, textTrack.label)
    textTrackPayload.putString(PROP_TYPE, textTrack.type.type)

    // THEOplayer v3.5+
    textTrackPayload.putString(PROP_SRC, textTrack.source)
    textTrackPayload.putBoolean(PROP_FORCED, textTrack.isForced)

    // Optionally pass cue list.
    val cueList = textTrack.cues
    if (cueList != null) {
      val cueListPayload = Arguments.createArray()
      for (cue in cueList) {
        cueListPayload.pushMap(fromTextTrackCue(cue))
      }
      textTrackPayload.putArray(PROP_CUES, cueListPayload)
    }
    return textTrackPayload
  }

  fun fromTextTrackCue(cue: TextTrackCue): WritableMap {
    val cuePayload = Arguments.createMap()
    cuePayload.putString(PROP_ID, cue.id)
    cuePayload.putDouble(PROP_UID, cue.uid.toDouble())
    cuePayload.putDouble(PROP_STARTTIME, TypeUtils.encodeInfNan(1e3 * cue.startTime))
    cuePayload.putDouble(PROP_ENDTIME, TypeUtils.encodeInfNan(1e3 * cue.endTime))
    val content = cue.content
    if (content != null) {
      cuePayload.putString(
        PROP_CUE_CONTENT,
        content.optString("content") ?: content.optString("contentString")
      )
    }

    if (cue is DateRangeCue) {
      cue.attributeClass?.run {
        cuePayload.putString(PROP_ATTRIBUTE_CLASS, this)
      }
      cuePayload.putDouble(PROP_STARTDATE, cue.startDate.time.toDouble())
      cue.endDate?.run {
        cuePayload.putDouble(PROP_ENDDATE, this.time.toDouble())
      }
      cue.duration?.run {
        cuePayload.putDouble(PROP_DURATION, TypeUtils.encodeInfNan(1e3 * this))
      }
      cue.plannedDuration?.run {
        cuePayload.putDouble(PROP_PLANNED_DURATION, TypeUtils.encodeInfNan(1e3 * this))
      }
      cuePayload.putBoolean(PROP_END_ON_NEXT, cue.isEndOnNext)
      cue.customAttributes.asMap()?.run {
        val attributes = Arguments.createMap()
        forEach { (key, value) ->
          when (value) {
            is String -> attributes.putString(key, value)
            is Boolean -> attributes.putBoolean(key, value)
            is Int -> attributes.putInt(key, value)
            is Double -> attributes.putDouble(key, value)
            // TODO: support array & sub-objects
          }
        }
        cuePayload.putMap(PROP_CUSTOM_ATTRIBUTES, attributes)
      }
      // TODO: Add SCTE marker properties
    }

    return cuePayload
  }

  fun fromQuality(quality: Quality): WritableMap {
    return if (quality is AudioQuality) fromAudioQuality(quality) else fromVideoQuality(quality as VideoQuality)
  }

  private fun fromAudioQuality(quality: AudioQuality): WritableMap {
    val audioQualityPayload = Arguments.createMap()
    audioQualityPayload.putString(PROP_ID, quality.id)
    audioQualityPayload.putInt(PROP_UID, quality.uid)
    audioQualityPayload.putString(PROP_CODECS, quality.codecs)
    audioQualityPayload.putString(PROP_NAME, quality.name)
    audioQualityPayload.putDouble(PROP_BANDWIDTH, quality.bandwidth.toDouble())
    audioQualityPayload.putDouble(
      PROP_AUDIO_SAMPLING_RATE,
      quality.audioSamplingRate.toDouble()
    )
    return audioQualityPayload
  }

  @Suppress("UNCHECKED_CAST")
  fun <Q : Quality?> fromMediaTrack(
    track: MediaTrack<Q>,
    trackType: MediaTrackType
  ): WritableMap {
    return if (trackType === MediaTrackType.AUDIO) fromAudioTrack(track as MediaTrack<AudioQuality>)
    else fromVideoTrack(track as MediaTrack<VideoQuality>)
  }

  private fun fromAudioTrack(audioTrack: MediaTrack<AudioQuality>): WritableMap {
    val audioTrackPayload = Arguments.createMap()
    audioTrackPayload.putString(PROP_ID, audioTrack.id)
    audioTrackPayload.putInt(PROP_UID, audioTrack.uid)
    audioTrackPayload.putString(PROP_KIND, audioTrack.kind)
    audioTrackPayload.putString(PROP_LABEL, audioTrack.label)
    audioTrackPayload.putString(PROP_LANGUAGE, audioTrack.language)
    audioTrackPayload.putBoolean(PROP_ENABLED, audioTrack.isEnabled)
    val qualityList = audioTrack.qualities
    val qualities = Arguments.createArray()
    try {
      qualityList?.forEach { quality ->
        qualities.pushMap(fromAudioQuality(quality))
      }
    } catch (ignore: NullPointerException) {
    }
    audioTrackPayload.putArray(PROP_QUALITIES, qualities)
    val activeQuality = audioTrack.activeQuality
    if (activeQuality != null) {
      audioTrackPayload.putMap(PROP_ACTIVE_QUALITY, fromQuality(activeQuality))
    }
    return audioTrackPayload
  }

  fun fromAudioTrackList(audioTrackList: MediaTrackList<AudioQuality>?): WritableArray {
    val audioTracks = Arguments.createArray()
    audioTrackList?.forEach { track ->
      audioTracks.pushMap(fromAudioTrack(track))
    }
    return audioTracks
  }

  private fun fromVideoQuality(quality: VideoQuality): WritableMap {
    val videoQualityPayload = Arguments.createMap()
    videoQualityPayload.putString(PROP_ID, quality.id)
    videoQualityPayload.putInt(PROP_UID, quality.uid)
    videoQualityPayload.putString(PROP_CODECS, quality.codecs)
    videoQualityPayload.putString(PROP_NAME, quality.name)
    videoQualityPayload.putDouble(PROP_BANDWIDTH, quality.bandwidth.toDouble())
    videoQualityPayload.putDouble(PROP_WIDTH, quality.width.toDouble())
    videoQualityPayload.putDouble(PROP_HEIGHT, quality.height.toDouble())
    videoQualityPayload.putDouble(PROP_FRAMERATE, quality.frameRate)
    return videoQualityPayload
  }

  private fun fromVideoTrack(videoTrack: MediaTrack<VideoQuality>): WritableMap {
    val videoTrackPayload = Arguments.createMap()
    videoTrackPayload.putString(PROP_ID, videoTrack.id)
    videoTrackPayload.putInt(PROP_UID, videoTrack.uid)
    videoTrackPayload.putString(PROP_KIND, videoTrack.kind)
    videoTrackPayload.putString(PROP_LABEL, videoTrack.label)
    videoTrackPayload.putString(PROP_LANGUAGE, videoTrack.language)
    videoTrackPayload.putBoolean(PROP_ENABLED, videoTrack.isEnabled)
    val qualities = Arguments.createArray()
    try {
      val qualityList = videoTrack.qualities
      if (qualityList != null) {
        // Sort qualities according to (height, bandwidth)
        val sortedQualityList = QualityListAdapter(qualityList)
        sortedQualityList.sort { o: VideoQuality, t1: VideoQuality ->
          if (o.height == t1.height) t1.bandwidth.compareTo(o.bandwidth) else t1.height.compareTo(o.height)
        }
        for (quality in sortedQualityList) {
          qualities.pushMap(fromVideoQuality(quality as VideoQuality))
        }
      }
    } catch (ignore: java.lang.NullPointerException) {
    }
    videoTrackPayload.putArray(PROP_QUALITIES, qualities)
    val activeQuality = videoTrack.activeQuality
    if (activeQuality != null) {
      videoTrackPayload.putMap(PROP_ACTIVE_QUALITY, fromQuality(activeQuality))
    }
    return videoTrackPayload
  }

  fun fromVideoTrackList(videoTrackList: MediaTrackList<VideoQuality>?): WritableArray {
    val videoTracks = Arguments.createArray()
    videoTrackList?.forEach { track ->
      videoTracks.pushMap(fromVideoTrack(track))
    }
    return videoTracks
  }
}
