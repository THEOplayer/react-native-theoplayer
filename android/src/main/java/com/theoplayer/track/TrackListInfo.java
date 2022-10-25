package com.theoplayer.track;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack;
import com.theoplayer.android.api.player.track.mediatrack.MediaTrackList;
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality;
import com.theoplayer.android.api.player.track.mediatrack.quality.Quality;
import com.theoplayer.android.api.player.track.mediatrack.quality.QualityList;
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality;
import com.theoplayer.android.api.player.track.texttrack.TextTrack;
import com.theoplayer.android.api.player.track.texttrack.TextTrackList;
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCue;
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCueList;

import org.json.JSONObject;

public class TrackListInfo {

  private static final String PROP_ID = "id";
  private static final String PROP_UID = "uid";
  private static final String PROP_KIND = "kind";
  private static final String PROP_LANGUAGE = "language";
  private static final String PROP_MODE = "mode";
  private static final String PROP_LABEL = "label";
  private static final String PROP_TYPE = "type";
  private static final String PROP_CODECS = "codecs";
  private static final String PROP_NAME = "name";
  private static final String PROP_SRC = "src";
  private static final String PROP_FORCED = "forced";
  private static final String PROP_AUDIO_SAMPLING_RATE = "audioSamplingRate";
  private static final String PROP_BANDWIDTH = "bandwidth";
  private static final String PROP_QUALITIES = "qualities";
  private static final String PROP_ACTIVE_QUALITY = "activeQuality";
  private static final String PROP_TARGET_QUALITY = "targetQuality";
  private static final String PROP_WIDTH = "width";
  private static final String PROP_HEIGHT = "height";
  private static final String PROP_FRAMERATE = "framerate";
  private static final String PROP_STARTTIME = "startTime";
  private static final String PROP_ENDTIME = "endTime";
  private static final String PROP_CUES = "cues";
  private static final String PROP_CUE_CONTENT = "content";

  public static WritableArray fromTextTrackList(final TextTrackList textTrackList) {
    WritableArray textTracks = Arguments.createArray();
    for (int i = 0; i < textTrackList.length(); i++) {
      textTracks.pushMap(fromTextTrack(textTrackList.getItem(i)));
    }
    return textTracks;
  }

  public static WritableMap fromTextTrack(final TextTrack textTrack) {
    WritableMap textTrackPayload = Arguments.createMap();
    textTrackPayload.putString(PROP_ID, textTrack.getId());
    textTrackPayload.putInt(PROP_UID, textTrack.getUid());
    textTrackPayload.putString(PROP_KIND, textTrack.getKind());
    textTrackPayload.putString(PROP_LANGUAGE, textTrack.getLanguage());
    textTrackPayload.putString(PROP_MODE, textTrack.getMode().getMode());
    textTrackPayload.putString(PROP_LABEL, textTrack.getLabel());
    textTrackPayload.putString(PROP_TYPE, textTrack.getType().getType());

    // THEOplayer v3.5+
    textTrackPayload.putString(PROP_SRC, textTrack.getSource());
    textTrackPayload.putBoolean(PROP_FORCED, textTrack.isForced());

    // Optionally pass cue list.
    final TextTrackCueList cueList = textTrack.getCues();
    if (cueList != null) {
      WritableArray cueListPayload = Arguments.createArray();
      for (TextTrackCue cue : cueList) {
        cueListPayload.pushMap(fromTextTrackCue(cue));
      }
      textTrackPayload.putArray(PROP_CUES, cueListPayload);
    }
    return textTrackPayload;
  }

  public static WritableMap fromTextTrackCue(final TextTrackCue cue) {
    WritableMap cuePayload = Arguments.createMap();
    cuePayload.putString(PROP_ID, cue.getId());
    cuePayload.putDouble(PROP_UID, cue.getUid());
    cuePayload.putDouble(PROP_STARTTIME, (long) (1e03 * cue.getStartTime()));
    cuePayload.putDouble(PROP_ENDTIME, (long) (1e03 * cue.getEndTime()));
    final JSONObject content = cue.getContent();
    if (content != null) {
      cuePayload.putString(PROP_CUE_CONTENT, content.optString("content"));
    }
    return cuePayload;
  }

  static public WritableMap fromQuality(@NonNull final Quality quality) {
    return quality instanceof AudioQuality ? fromAudioQuality((AudioQuality)quality) : fromVideoQuality((VideoQuality) quality);
  }

  static public WritableMap fromAudioQuality(@NonNull final AudioQuality quality) {
    WritableMap audioQualityPayload = Arguments.createMap();
    audioQualityPayload.putString(PROP_ID, quality.getId());
    audioQualityPayload.putInt(PROP_UID, quality.getUid());
    audioQualityPayload.putString(PROP_CODECS, quality.getCodecs());
    audioQualityPayload.putString(PROP_NAME, quality.getName());
    audioQualityPayload.putDouble(PROP_BANDWIDTH, quality.getBandwidth());
    audioQualityPayload.putDouble(PROP_AUDIO_SAMPLING_RATE, quality.getAudioSamplingRate());
    return audioQualityPayload;
  }

  static public <Q extends Quality> WritableMap fromMediaTrack(@NonNull final MediaTrack<Q> track,
                                                               MediaTrackType trackType) {
    //noinspection unchecked
    return trackType == MediaTrackType.AUDIO ?
      fromAudioTrack((MediaTrack<AudioQuality>)track) :
      fromVideoTrack((MediaTrack<VideoQuality>)track);
  }

  static public WritableMap fromAudioTrack(@NonNull final MediaTrack<AudioQuality> audioTrack) {
    WritableMap audioTrackPayload = Arguments.createMap();
    audioTrackPayload.putString(PROP_ID, audioTrack.getId());
    audioTrackPayload.putInt(PROP_UID, audioTrack.getUid());
    audioTrackPayload.putString(PROP_KIND, audioTrack.getKind());
    audioTrackPayload.putString(PROP_LABEL, audioTrack.getLabel());
    audioTrackPayload.putString(PROP_LANGUAGE, audioTrack.getLanguage());

    final QualityList<AudioQuality> qualityList = audioTrack.getQualities();
    WritableArray qualities = Arguments.createArray();
    if (qualityList != null) {
      for (int j = 0; j < qualityList.length(); j++) {
        qualities.pushMap(fromAudioQuality(qualityList.getItem(j)));
      }
    }
    audioTrackPayload.putArray(PROP_QUALITIES, qualities);

    final QualityList<AudioQuality> targetQualityList = audioTrack.getTargetQualities();
    WritableArray targetQualities = Arguments.createArray();
    if (targetQualityList != null) {
      for (int j = 0; j < targetQualityList.length(); j++) {
        final AudioQuality quality = targetQualityList.getItem(j);
        WritableMap audioQualityPayload = Arguments.createMap();
        audioQualityPayload.putInt(PROP_UID, quality.getUid());
        targetQualities.pushMap(audioQualityPayload);
      }
    }
    final AudioQuality activeQuality = audioTrack.getActiveQuality();
    if (activeQuality != null) {
      audioTrackPayload.putInt(PROP_ACTIVE_QUALITY, activeQuality.getUid());
    }
    final AudioQuality targetQuality = audioTrack.getTargetQuality();
    if (targetQuality != null) {
      audioTrackPayload.putInt(PROP_TARGET_QUALITY, targetQuality.getUid());
    }
    return audioTrackPayload;
  }

  @NonNull
  public static WritableArray fromAudioTrackList(@NonNull final MediaTrackList<AudioQuality> audioTrackList) {
    WritableArray audioTracks = Arguments.createArray();
    for (int i = 0; i < audioTrackList.length(); i++) {
      audioTracks.pushMap(fromAudioTrack(audioTrackList.getItem(i)));
    }
    return audioTracks;
  }

  static public WritableMap fromVideoQuality(@NonNull final VideoQuality quality) {
    WritableMap videoQualityPayload = Arguments.createMap();
    videoQualityPayload.putString(PROP_ID, quality.getId());
    videoQualityPayload.putInt(PROP_UID, quality.getUid());
    videoQualityPayload.putString(PROP_CODECS, quality.getCodecs());
    videoQualityPayload.putString(PROP_NAME, quality.getName());
    videoQualityPayload.putDouble(PROP_BANDWIDTH, quality.getBandwidth());
    videoQualityPayload.putDouble(PROP_WIDTH, quality.getWidth());
    videoQualityPayload.putDouble(PROP_HEIGHT, quality.getHeight());
    videoQualityPayload.putDouble(PROP_FRAMERATE, quality.getFrameRate());
    return videoQualityPayload;
  }

  static public WritableMap fromVideoTrack(@NonNull final MediaTrack<VideoQuality> videoTrack) {
    WritableMap videoTrackPayload = Arguments.createMap();
    videoTrackPayload.putString(PROP_ID, videoTrack.getId());
    videoTrackPayload.putInt(PROP_UID, videoTrack.getUid());
    videoTrackPayload.putString(PROP_KIND, videoTrack.getKind());
    videoTrackPayload.putString(PROP_LABEL, videoTrack.getLabel());
    videoTrackPayload.putString(PROP_LANGUAGE, videoTrack.getLanguage());

    final QualityList<VideoQuality> qualityList = videoTrack.getQualities();
    WritableArray qualities = Arguments.createArray();

    if (qualityList != null) {
      // Sort qualities according to (height, bandwidth)
      final QualityListAdapter<VideoQuality> sortedQualityList = new QualityListAdapter<>(qualityList);
      sortedQualityList.sort(
        (o, t1) ->
          (o.getHeight() == t1.getHeight()) ?
            Long.compare(t1.getBandwidth(), o.getBandwidth()) : Integer.compare(t1.getHeight(), o.getHeight())
      );

      for (final VideoQuality quality : sortedQualityList) {
        qualities.pushMap(fromVideoQuality(quality));
      }
    }
    videoTrackPayload.putArray(PROP_QUALITIES, qualities);

    final QualityList<VideoQuality> targetQualityList = videoTrack.getTargetQualities();
    WritableArray targetQualities = Arguments.createArray();
    if (targetQualityList != null) {
      for (int j = 0; j < targetQualityList.length(); j++) {
        final VideoQuality quality = targetQualityList.getItem(j);
        WritableMap videoQualityPayload = Arguments.createMap();
        videoQualityPayload.putInt(PROP_UID, quality.getUid());
        targetQualities.pushMap(videoQualityPayload);
      }
    }

    final VideoQuality activeQuality = videoTrack.getActiveQuality();
    if (activeQuality != null) {
      videoTrackPayload.putInt(PROP_ACTIVE_QUALITY, activeQuality.getUid());
    }

    final VideoQuality targetQuality = videoTrack.getTargetQuality();
    if (targetQuality != null) {
      videoTrackPayload.putInt(PROP_TARGET_QUALITY, targetQuality.getUid());
    }
    return videoTrackPayload;
  }

  @NonNull
  static public WritableArray fromVideoTrackList(@NonNull final MediaTrackList<VideoQuality> videoTrackList) {
    WritableArray videoTracks = Arguments.createArray();
    for (int i = 0; i < videoTrackList.length(); i++) {
      videoTracks.pushMap(fromVideoTrack(videoTrackList.getItem(i)));
    }
    return videoTracks;
  }
}
