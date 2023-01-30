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

private const val PROP_ID = "id"
private const val PROP_UID = "uid"
private const val PROP_KIND = "kind"
private const val PROP_LANGUAGE = "language"
private const val PROP_MODE = "mode"
private const val PROP_LABEL = "label"
private const val PROP_TYPE = "type"
private const val PROP_CODECS = "codecs"
private const val PROP_NAME = "name"
private const val PROP_SRC = "src"
private const val PROP_FORCED = "forced"
private const val PROP_AUDIO_SAMPLING_RATE = "audioSamplingRate"
private const val PROP_BANDWIDTH = "bandwidth"
private const val PROP_QUALITIES = "qualities"
private const val PROP_ACTIVE_QUALITY = "activeQuality"
private const val PROP_TARGET_QUALITY = "targetQuality"
private const val PROP_WIDTH = "width"
private const val PROP_HEIGHT = "height"
private const val PROP_FRAMERATE = "framerate"
private const val PROP_STARTTIME = "startTime"
private const val PROP_ENDTIME = "endTime"
private const val PROP_CUES = "cues"
private const val PROP_CUE_CONTENT = "content"

class TrackListAdapter {

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
    cuePayload.putDouble(PROP_STARTTIME, (1e03 * cue.startTime).toLong().toDouble())
    cuePayload.putDouble(PROP_ENDTIME, (1e03 * cue.endTime).toLong().toDouble())
    val content = cue.content
    if (content != null) {
      cuePayload.putString(PROP_CUE_CONTENT, content.optString("content"))
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
    val qualityList = audioTrack.qualities
    val qualities = Arguments.createArray()
    qualityList?.forEach { quality ->
      qualities.pushMap(fromAudioQuality(quality))
    }
    audioTrackPayload.putArray(PROP_QUALITIES, qualities)
    val targetQualityList = audioTrack.targetQualities
    val targetQualities = Arguments.createArray()
    targetQualityList?.forEach { quality ->
      val audioQualityPayload = Arguments.createMap()
      audioQualityPayload.putInt(PROP_UID, quality.uid)
      targetQualities.pushMap(audioQualityPayload)
    }
    val activeQuality = audioTrack.activeQuality
    if (activeQuality != null) {
      audioTrackPayload.putInt(PROP_ACTIVE_QUALITY, activeQuality.uid)
    }
    val targetQuality = audioTrack.targetQuality
    if (targetQuality != null) {
      audioTrackPayload.putInt(PROP_TARGET_QUALITY, targetQuality.uid)
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
    val qualityList = videoTrack.qualities
    val qualities = Arguments.createArray()
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
    videoTrackPayload.putArray(PROP_QUALITIES, qualities)
    val targetQualityList = videoTrack.targetQualities
    val targetQualities = Arguments.createArray()
    targetQualityList?.forEach { quality ->
      val videoQualityPayload = Arguments.createMap()
      videoQualityPayload.putInt(PROP_UID, quality.uid)
      targetQualities.pushMap(videoQualityPayload)
    }
    val activeQuality = videoTrack.activeQuality
    if (activeQuality != null) {
      videoTrackPayload.putInt(PROP_ACTIVE_QUALITY, activeQuality.uid)
    }
    val targetQuality = videoTrack.targetQuality
    if (targetQuality != null) {
      videoTrackPayload.putInt(PROP_TARGET_QUALITY, targetQuality.uid)
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
