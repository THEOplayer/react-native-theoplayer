package com.theoplayer;

import static com.theoplayer.android.api.event.player.PlayerEventTypes.DURATIONCHANGE;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.ENDED;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.ERROR;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.LOADEDDATA;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.LOADEDMETADATA;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.LOADSTART;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.PAUSE;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.PLAY;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.PLAYING;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.PROGRESS;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.READYSTATECHANGE;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.SEEKED;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.SEEKING;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.SEGMENTNOTFOUND;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.SOURCECHANGE;
import static com.theoplayer.android.api.event.player.PlayerEventTypes.TIMEUPDATE;

import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.StringDef;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.theoplayer.ads.AdEventAdapter;
import com.theoplayer.android.api.error.THEOplayerException;
import com.theoplayer.android.api.event.EventListener;
import com.theoplayer.android.api.event.EventType;
import com.theoplayer.android.api.event.player.DurationChangeEvent;
import com.theoplayer.android.api.event.player.ErrorEvent;
import com.theoplayer.android.api.event.player.LoadedMetadataEvent;
import com.theoplayer.android.api.event.player.PauseEvent;
import com.theoplayer.android.api.event.player.ReadyStateChangeEvent;
import com.theoplayer.android.api.event.player.SeekedEvent;
import com.theoplayer.android.api.event.player.SeekingEvent;
import com.theoplayer.android.api.event.player.SegmentNotFoundEvent;
import com.theoplayer.android.api.event.player.TimeUpdateEvent;
import com.theoplayer.android.api.event.track.mediatrack.audio.ActiveQualityChangedEvent;
import com.theoplayer.android.api.event.track.mediatrack.audio.AudioTrackEventTypes;
import com.theoplayer.android.api.event.track.mediatrack.audio.QualityChangedEvent;
import com.theoplayer.android.api.event.track.mediatrack.audio.list.AudioTrackListEventTypes;
import com.theoplayer.android.api.event.track.mediatrack.video.VideoTrackEventTypes;
import com.theoplayer.android.api.event.track.mediatrack.video.list.VideoTrackListEventTypes;
import com.theoplayer.android.api.event.track.texttrack.AddCueEvent;
import com.theoplayer.android.api.event.track.texttrack.RemoveCueEvent;
import com.theoplayer.android.api.event.track.texttrack.TextTrackEventTypes;
import com.theoplayer.android.api.event.track.texttrack.list.AddTrackEvent;
import com.theoplayer.android.api.event.track.texttrack.list.RemoveTrackEvent;
import com.theoplayer.android.api.event.track.texttrack.list.TextTrackListEventTypes;
import com.theoplayer.android.api.event.track.texttrack.list.TrackListChangeEvent;
import com.theoplayer.android.api.player.Player;
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack;
import com.theoplayer.android.api.player.track.mediatrack.MediaTrackList;
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality;
import com.theoplayer.android.api.player.track.mediatrack.quality.Quality;
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality;
import com.theoplayer.android.api.player.track.texttrack.TextTrack;
import com.theoplayer.track.MediaTrackEventType;
import com.theoplayer.track.MediaTrackType;
import com.theoplayer.cast.CastEventAdapter;
import com.theoplayer.track.TextTrackCueEventType;
import com.theoplayer.track.TrackEventType;
import com.theoplayer.track.TrackListInfo;
import com.theoplayer.util.TypeUtils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@SuppressWarnings({"rawtypes", "unchecked"})
public class VideoEventEmitter {

  private static final String EVENT_SOURCECHANGE = "onNativeSourceChange";
  private static final String EVENT_LOADSTART = "onNativeLoadStart";
  private static final String EVENT_LOADEDMETADATA = "onNativeLoadedMetadata";
  private static final String EVENT_LOADEDDATA = "onNativeLoadedData";
  private static final String EVENT_PLAY = "onNativePlay";
  private static final String EVENT_PLAYING = "onNativePlaying";
  private static final String EVENT_PAUSE = "onNativePause";
  private static final String EVENT_ERROR = "onNativeError";
  private static final String EVENT_PROGRESS = "onNativeProgress";
  private static final String EVENT_SEEKING = "onNativeSeeking";
  private static final String EVENT_SEEKED = "onNativeSeeked";
  private static final String EVENT_ENDED = "onNativeEnded";
  private static final String EVENT_READYSTATECHANGE = "onNativeReadyStateChange";
  private static final String EVENT_TIMEUPDATE = "onNativeTimeUpdate";
  private static final String EVENT_DURATIONCHANGE = "onNativeDurationChange";
  private static final String EVENT_SEGMENTNOTFOUND = "onNativeSegmentNotFound";
  private static final String EVENT_TEXTTRACK_LIST_EVENT = "onNativeTextTrackListEvent";
  private static final String EVENT_TEXTTRACK_EVENT = "onNativeTextTrackEvent";
  private static final String EVENT_MEDIATRACK_LIST_EVENT = "onNativeMediaTrackListEvent";
  private static final String EVENT_MEDIATRACK_EVENT = "onNativeMediaTrackEvent";
  private static final String EVENT_AD_EVENT = "onNativeAdEvent";
  private static final String EVENT_FULLSCREEN_WILL_PRESENT = "onNativeFullscreenPlayerWillPresent";
  private static final String EVENT_FULLSCREEN_DID_PRESENT = "onNativeFullscreenPlayerDidPresent";
  private static final String EVENT_FULLSCREEN_WILL_DISMISS = "onNativeFullscreenPlayerWillDismiss";
  private static final String EVENT_FULLSCREEN_DID_DISMISS = "onNativeFullscreenPlayerDidDismiss";
  private static final String EVENT_CAST_EVENT = "onNativeCastEvent";

  private static final String TAG = VideoEventEmitter.class.getName();

  static final String[] Events = {
    EVENT_SOURCECHANGE,
    EVENT_LOADSTART,
    EVENT_LOADEDMETADATA,
    EVENT_LOADEDDATA,
    EVENT_PLAY,
    EVENT_PLAYING,
    EVENT_PAUSE,
    EVENT_ERROR,
    EVENT_PROGRESS,
    EVENT_SEEKING,
    EVENT_SEEKED,
    EVENT_ENDED,
    EVENT_READYSTATECHANGE,
    EVENT_TIMEUPDATE,
    EVENT_DURATIONCHANGE,
    EVENT_SEGMENTNOTFOUND,
    EVENT_TEXTTRACK_LIST_EVENT,
    EVENT_TEXTTRACK_EVENT,
    EVENT_MEDIATRACK_LIST_EVENT,
    EVENT_MEDIATRACK_EVENT,
    EVENT_AD_EVENT,
    EVENT_FULLSCREEN_WILL_PRESENT,
    EVENT_FULLSCREEN_DID_PRESENT,
    EVENT_FULLSCREEN_WILL_DISMISS,
    EVENT_FULLSCREEN_DID_DISMISS,
    EVENT_CAST_EVENT
  };

  @Retention(RetentionPolicy.SOURCE)
  @StringDef({
    EVENT_SOURCECHANGE,
    EVENT_LOADSTART,
    EVENT_LOADEDMETADATA,
    EVENT_LOADEDDATA,
    EVENT_PLAY,
    EVENT_PLAYING,
    EVENT_PAUSE,
    EVENT_ERROR,
    EVENT_PROGRESS,
    EVENT_SEEKING,
    EVENT_SEEKED,
    EVENT_ENDED,
    EVENT_READYSTATECHANGE,
    EVENT_TIMEUPDATE,
    EVENT_DURATIONCHANGE,
    EVENT_SEGMENTNOTFOUND,
    EVENT_TEXTTRACK_LIST_EVENT,
    EVENT_TEXTTRACK_EVENT,
    EVENT_MEDIATRACK_LIST_EVENT,
    EVENT_MEDIATRACK_EVENT,
    EVENT_AD_EVENT,
    EVENT_FULLSCREEN_WILL_PRESENT,
    EVENT_FULLSCREEN_DID_PRESENT,
    EVENT_FULLSCREEN_WILL_DISMISS,
    EVENT_FULLSCREEN_DID_DISMISS,
    EVENT_CAST_EVENT
  })
  public @interface VideoEvents {
  }

  private static final String EVENT_PROP_CURRENT_TIME = "currentTime";
  private static final String EVENT_PROP_CURRENT_PROGRAM_DATE_TIME = "currentProgramDateTime";
  private static final String EVENT_PROP_DURATION = "duration";
  private static final String EVENT_PROP_READYSTATE = "readyState";
  private static final String EVENT_PROP_ERROR = "error";
  private static final String EVENT_PROP_ERROR_CODE = "errorCode";
  private static final String EVENT_PROP_ERROR_MESSAGE = "errorMessage";
  private static final String EVENT_PROP_TEXT_TRACKS = "textTracks";
  private static final String EVENT_PROP_AUDIO_TRACKS = "audioTracks";
  private static final String EVENT_PROP_VIDEO_TRACKS = "videoTracks";
  private static final String EVENT_PROP_SELECTED_TEXT_TRACK = "selectedTextTrack";
  private static final String EVENT_PROP_SELECTED_AUDIO_TRACK = "selectedAudioTrack";
  private static final String EVENT_PROP_SELECTED_VIDEO_TRACK = "selectedVideoTrack";
  private static final String EVENT_PROP_SEEKABLE = "seekable";
  private static final String EVENT_PROP_START = "start";
  private static final String EVENT_PROP_END = "end";
  private static final String EVENT_PROP_RETRYCOUNT = "retryCount";
  private static final String EVENT_PROP_SEGMENTSTARTTIME = "segmentStartTime";
  private static final String EVENT_PROP_TRACK = "track";
  private static final String EVENT_PROP_TRACK_UID = "trackUid";
  private static final String EVENT_PROP_TRACK_TYPE = "trackType";
  private static final String EVENT_PROP_CUE = "cue";
  private static final String EVENT_PROP_TYPE = "type";
  private static final String EVENT_PROP_QUALITIES = "qualities";

  private final RCTEventEmitter eventEmitter;
  private int viewId = View.NO_ID;
  private final HashMap<EventType, EventListener> playerListeners = new HashMap<>();
  private final HashMap<EventType, EventListener> textTrackListeners = new HashMap<>();
  private final HashMap<EventType, EventListener> audioTrackListeners = new HashMap<>();
  private final HashMap<EventType, EventListener> videoTrackListeners = new HashMap<>();
  private final ReactTHEOplayerView playerView;

  private AdEventAdapter adEventAdapter;
  private CastEventAdapter castEventAdapter;
  private long lastTimeUpdate = 0;
  private double lastCurrentTime = 0.0;

  VideoEventEmitter(@NonNull ReactContext reactContext, @NonNull final ReactTHEOplayerView playerView) {
    this.eventEmitter = reactContext.getJSModule(RCTEventEmitter.class);
    this.playerView = playerView;

    // Create listeners
    playerListeners.put(SOURCECHANGE, event -> receiveEvent(EVENT_SOURCECHANGE, null));
    playerListeners.put(LOADSTART, event -> receiveEvent(EVENT_LOADSTART, null));
    playerListeners.put(LOADEDMETADATA, (EventListener<LoadedMetadataEvent>) this::onLoadedMetadata);
    playerListeners.put(LOADEDDATA, event -> receiveEvent(EVENT_LOADEDDATA, null));
    playerListeners.put(PLAY, event -> receiveEvent(EVENT_PLAY, null));
    playerListeners.put(PLAYING, event -> receiveEvent(EVENT_PLAYING, null));
    playerListeners.put(READYSTATECHANGE, (EventListener<ReadyStateChangeEvent>) this::onReadyState);
    playerListeners.put(SEEKING, (EventListener<SeekingEvent>) this::onSeeking);
    playerListeners.put(SEEKED, (EventListener<SeekedEvent>) this::onSeeked);
    playerListeners.put(ERROR, (EventListener<ErrorEvent>) this::onError);
    playerListeners.put(ENDED, event -> receiveEvent(EVENT_ENDED, null));
    playerListeners.put(PROGRESS, event -> onProgress());
    playerListeners.put(TIMEUPDATE, (EventListener<TimeUpdateEvent>) this::onTimeUpdate);
    playerListeners.put(DURATIONCHANGE, (EventListener<DurationChangeEvent>) this::onDurationChange);
    playerListeners.put(PAUSE, (EventListener<PauseEvent>) this::onPause);
    playerListeners.put(SEGMENTNOTFOUND, (EventListener<SegmentNotFoundEvent>) this::onSegmentNotFound);

    textTrackListeners.put(TextTrackListEventTypes.ADDTRACK, (EventListener<AddTrackEvent>) this::onTextTrackAdd);
    textTrackListeners.put(TextTrackListEventTypes.REMOVETRACK, (EventListener<RemoveTrackEvent>) this::onTextTrackRemove);
    textTrackListeners.put(TextTrackListEventTypes.TRACKLISTCHANGE, (EventListener<TrackListChangeEvent>) this::onTextTrackChange);
    audioTrackListeners.put(AudioTrackListEventTypes.ADDTRACK, (EventListener<com.theoplayer.android.api.event.track.mediatrack.audio.list.AddTrackEvent>) this::onAudioTrackAdd);
    audioTrackListeners.put(AudioTrackListEventTypes.REMOVETRACK, (EventListener<com.theoplayer.android.api.event.track.mediatrack.audio.list.RemoveTrackEvent>) this::onAudioTrackRemove);
    audioTrackListeners.put(AudioTrackListEventTypes.TRACKLISTCHANGE, (EventListener<com.theoplayer.android.api.event.track.mediatrack.audio.list.TrackListChangeEvent>) this::onAudioTrackChange);
    videoTrackListeners.put(VideoTrackListEventTypes.ADDTRACK, (EventListener<com.theoplayer.android.api.event.track.mediatrack.video.list.AddTrackEvent>) this::onVideoTrackAdd);
    videoTrackListeners.put(VideoTrackListEventTypes.REMOVETRACK, (EventListener<com.theoplayer.android.api.event.track.mediatrack.video.list.RemoveTrackEvent>) this::onVideoTrackRemove);
    videoTrackListeners.put(VideoTrackListEventTypes.TRACKLISTCHANGE, (EventListener<com.theoplayer.android.api.event.track.mediatrack.video.list.TrackListChangeEvent>) this::onVideoTrackChange);
  }

  public void setViewId(int viewId) {
    this.viewId = viewId;
  }

  public void emitError(@NonNull THEOplayerException exception) {
    emitError(exception.getCode().name(), exception.getMessage());
  }

  public void emitError(@NonNull String code, @Nullable String message) {
    WritableMap error = Arguments.createMap();
    error.putString(EVENT_PROP_ERROR_CODE, code);
    error.putString(EVENT_PROP_ERROR_MESSAGE, message != null ? message : "");
    WritableMap payload = Arguments.createMap();
    payload.putMap(EVENT_PROP_ERROR, error);
    receiveEvent(EVENT_ERROR, payload);
  }

  private void onLoadedMetadata(final LoadedMetadataEvent event) {
    WritableMap payload = Arguments.createMap();
    payload.putArray(EVENT_PROP_TEXT_TRACKS, playerView.getTextTrackInfo());
    payload.putArray(EVENT_PROP_AUDIO_TRACKS, playerView.getAudioTrackInfo());
    payload.putArray(EVENT_PROP_VIDEO_TRACKS, playerView.getVideoTrackInfo());
    TextTrack selectedTextTrack = playerView.getSelectedTextTrack();
    if (selectedTextTrack != null) {
      payload.putInt(EVENT_PROP_SELECTED_TEXT_TRACK, selectedTextTrack.getUid());
    }
    MediaTrack<AudioQuality> selectedAudioTrack = playerView.getSelectedAudioTrack();
    if (selectedAudioTrack != null) {
      payload.putInt(EVENT_PROP_SELECTED_AUDIO_TRACK, selectedAudioTrack.getUid());
    }
    MediaTrack<VideoQuality> selectedVideoTrack = playerView.getSelectedVideoTrack();
    if (selectedVideoTrack != null) {
      payload.putInt(EVENT_PROP_SELECTED_VIDEO_TRACK, selectedVideoTrack.getUid());
    }
    payload.putDouble(EVENT_PROP_DURATION, playerView.getDuration());
    receiveEvent(EVENT_LOADEDMETADATA, payload);
  }

  private void onSeeking(@NonNull SeekingEvent event) {
    WritableMap payload = Arguments.createMap();
    payload.putDouble(EVENT_PROP_CURRENT_TIME, (long) (1e03 * event.getCurrentTime()));
    receiveEvent(EVENT_SEEKING, payload);
  }

  private void onSeeked(@NonNull SeekedEvent event) {
    WritableMap payload = Arguments.createMap();
    payload.putDouble(EVENT_PROP_CURRENT_TIME, (long) (1e03 * event.getCurrentTime()));
    receiveEvent(EVENT_SEEKED, payload);
  }

  private boolean shouldSkipTimeUpdate(long now, double currentTime) {
    final TimeUpdateRate timeUpdateRate = BuildConfig.TIMEUPDATE_RATE;

    // No limited update rate.
    if (timeUpdateRate == TimeUpdateRate.UNLIMITED) {
      return false;
    }

    // Try to align updates on second boundary.
    if (Math.floor(lastCurrentTime) != Math.floor(currentTime)) {
      return false;
    }

    // Limit update rate.
    long dt = now - lastTimeUpdate;
    return (timeUpdateRate == TimeUpdateRate.LIMITED_ONE_HZ && dt < 1e03) ||
      (timeUpdateRate == TimeUpdateRate.LIMITED_TWO_HZ && dt < 500) ||
      (timeUpdateRate == TimeUpdateRate.LIMITED_THREE_HZ && dt < 333);
  }

  private void onPause(@NonNull final PauseEvent event) {
    Player player = playerView.getPlayer();
    // Do not forward the pause event in case the content player is paused because the ad player starts.
    if (player != null && !playerView.getAdsApi().isPlaying()) {
      receiveEvent(EVENT_PAUSE, null);
    }
  }

  private void onTimeUpdate(@NonNull final TimeUpdateEvent event) {
    final long now = System.currentTimeMillis();
    final double currentTime = event.getCurrentTime();

    // Check for limited timeUpdates
    if (shouldSkipTimeUpdate(now, currentTime)) {
      return;
    }
    lastTimeUpdate = now;
    lastCurrentTime = currentTime;

    WritableMap payload = Arguments.createMap();
    payload.putDouble(EVENT_PROP_CURRENT_TIME, (long) (1e03 * currentTime));
    final Date currentProgramDateTime = event.getCurrentProgramDateTime();
    if (currentProgramDateTime != null) {
      payload.putDouble(EVENT_PROP_CURRENT_PROGRAM_DATE_TIME, (long) (1e03 * currentProgramDateTime.getTime()));
    }
    receiveEvent(EVENT_TIMEUPDATE, payload);
  }

  private void onReadyState(@NonNull final ReadyStateChangeEvent event) {
    WritableMap payload = Arguments.createMap();
    payload.putInt(EVENT_PROP_READYSTATE, event.getReadyState().ordinal());
    receiveEvent(EVENT_READYSTATECHANGE, payload);
  }

  private void onDurationChange(final @NonNull DurationChangeEvent event) {
    WritableMap payload = Arguments.createMap();
    payload.putDouble(EVENT_PROP_DURATION, TypeUtils.INSTANCE.encodeInfNan(1e03 * event.getDuration()));
    receiveEvent(EVENT_DURATIONCHANGE, payload);
  }

  private void onError(@NonNull final ErrorEvent event) {
    emitError(event.getErrorObject());
  }

  private void onProgress() {
    playerView.getSeekableRange(timeRanges -> {
      final WritableMap payload = Arguments.createMap();
      if (timeRanges != null) {
        final WritableArray seekable = Arguments.createArray();
        for (int i = 0; i < timeRanges.length(); i++) {
          WritableMap range = Arguments.createMap();
          range.putDouble(EVENT_PROP_START, 1e03 * timeRanges.getStart(i));
          range.putDouble(EVENT_PROP_END, 1e03 * timeRanges.getEnd(i));
          seekable.pushMap(range);
        }
        payload.putArray(EVENT_PROP_SEEKABLE, seekable);
      }
      receiveEvent(EVENT_PROGRESS, payload);
    });
  }

  private void onSegmentNotFound(@NonNull SegmentNotFoundEvent event) {
    WritableMap payload = Arguments.createMap();
    payload.putDouble(EVENT_PROP_SEGMENTSTARTTIME, 1e03 * event.getSegmentStartTime());
    payload.putString(EVENT_PROP_ERROR, event.getError());
    payload.putInt(EVENT_PROP_RETRYCOUNT, event.getRetryCount());
    receiveEvent(EVENT_SEGMENTNOTFOUND, payload);
  }

  private void dispatchTextTrackEvent(TrackEventType eventType, TextTrack textTrack) {
    WritableMap payload = Arguments.createMap();
    payload.putMap(EVENT_PROP_TRACK, playerView.getTextTrackInfo(textTrack));
    payload.putInt(EVENT_PROP_TYPE, eventType.type);
    switch (eventType) {
      case ADD_TRACK:
        textTrack.addEventListener(TextTrackEventTypes.ADDCUE, this::onTextTrackAddCue);
        textTrack.addEventListener(TextTrackEventTypes.REMOVECUE, this::onTextTrackRemoveCue);
        break;
      case REMOVE_TRACK:
        textTrack.removeEventListener(TextTrackEventTypes.ADDCUE, this::onTextTrackAddCue);
        textTrack.removeEventListener(TextTrackEventTypes.REMOVECUE, this::onTextTrackRemoveCue);
        break;
    }
    receiveEvent(EVENT_TEXTTRACK_LIST_EVENT, payload);
  }

  private void onTextTrackAdd(@NonNull AddTrackEvent event) {
    dispatchTextTrackEvent(TrackEventType.ADD_TRACK, event.getTrack());
  }

  private void onTextTrackRemove(@NonNull RemoveTrackEvent event) {
    dispatchTextTrackEvent(TrackEventType.REMOVE_TRACK, event.getTrack());
  }

  private void onTextTrackChange(@NonNull TrackListChangeEvent event) {
    dispatchTextTrackEvent(TrackEventType.CHANGE_TRACK, event.getTrack());
  }

  private void onTextTrackAddCue(@NonNull AddCueEvent event) {
    WritableMap payload = Arguments.createMap();
    payload.putInt(EVENT_PROP_TRACK_UID, event.getTrack().getUid());
    payload.putInt(EVENT_PROP_TYPE, TextTrackCueEventType.ADD_CUE.type);
    payload.putMap(EVENT_PROP_CUE, playerView.getTextTrackCueInfo(event.getCue()));
    receiveEvent(EVENT_TEXTTRACK_EVENT, payload);
  }

  private void onTextTrackRemoveCue(@NonNull RemoveCueEvent event) {
    WritableMap payload = Arguments.createMap();
    payload.putInt(EVENT_PROP_TRACK_UID, event.getTrack().getUid());
    payload.putInt(EVENT_PROP_TYPE, TextTrackCueEventType.REMOVE_CUE.type);
    payload.putMap(EVENT_PROP_CUE, playerView.getTextTrackCueInfo(event.getCue()));
    receiveEvent(EVENT_TEXTTRACK_EVENT, payload);
  }

  private MediaTrack<AudioQuality> activeAudioTrack() {
    return playerView.getPlayer() != null ? activeTrack(playerView.getPlayer().getAudioTracks()) : null;
  }

  private MediaTrack<VideoQuality> activeVideoTrack() {
    return playerView.getPlayer() != null ? activeTrack(playerView.getPlayer().getVideoTracks()) : null;
  }

  private <T extends Quality> MediaTrack<T> activeTrack(final MediaTrackList<T> tracks) {
    for (int i = 0; i < tracks.length(); i++) {
      MediaTrack<T> track = tracks.getItem(i);
      if (track.isEnabled()) {
        return track;
      }
    }
    return null;
  }

  private void onActiveQualityChanged(@NonNull QualityChangedEvent event) {
    Quality quality = event.getQuality();
    MediaTrackType trackType = quality instanceof AudioQuality ? MediaTrackType.AUDIO : MediaTrackType.VIDEO;
    WritableMap payload = Arguments.createMap();
    payload.putInt(EVENT_PROP_TYPE, MediaTrackEventType.ACTIVE_QUALITY_CHANGED.type);
    payload.putInt(EVENT_PROP_TRACK_TYPE, trackType.type);
    MediaTrack<? extends Quality> activeTrack = (trackType == MediaTrackType.AUDIO) ? activeAudioTrack() : activeVideoTrack();
    if (activeTrack != null) {
      payload.putInt(EVENT_PROP_TRACK_UID, activeTrack.getUid());
    }
    WritableArray qualities = Arguments.createArray();
    qualities.pushMap(TrackListInfo.fromQuality(quality));
    payload.putArray(EVENT_PROP_QUALITIES, qualities);
    receiveEvent(EVENT_MEDIATRACK_EVENT, payload);
  }

  private <Q extends Quality> void dispatchMediaTrackEvent(TrackEventType eventType, MediaTrackType trackType, MediaTrack<Q> track) {
    WritableMap payload = Arguments.createMap();
    payload.putInt(EVENT_PROP_TYPE, eventType.type);
    payload.putInt(EVENT_PROP_TRACK_TYPE, trackType.type);
    payload.putMap(EVENT_PROP_TRACK, TrackListInfo.fromMediaTrack(track, trackType));
    EventType<QualityChangedEvent<Q, ActiveQualityChangedEvent>> qualityChangedEventType =
      (EventType<QualityChangedEvent<Q, ActiveQualityChangedEvent>>) (trackType == MediaTrackType.AUDIO ?
        AudioTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT : VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT);

    switch (eventType) {
      case ADD_TRACK:
        track.addEventListener(qualityChangedEventType, this::onActiveQualityChanged);
        break;
      case REMOVE_TRACK:
        track.removeEventListener(qualityChangedEventType, this::onActiveQualityChanged);
        break;
    }
    receiveEvent(EVENT_MEDIATRACK_LIST_EVENT, payload);
  }

  private void onAudioTrackAdd(@NonNull com.theoplayer.android.api.event.track.mediatrack.audio.list.AddTrackEvent event) {
    dispatchMediaTrackEvent(TrackEventType.ADD_TRACK, MediaTrackType.AUDIO, event.getTrack());
  }

  private void onVideoTrackAdd(@NonNull com.theoplayer.android.api.event.track.mediatrack.video.list.AddTrackEvent event) {
    dispatchMediaTrackEvent(TrackEventType.ADD_TRACK, MediaTrackType.VIDEO, event.getTrack());
  }

  private void onAudioTrackRemove(@NonNull com.theoplayer.android.api.event.track.mediatrack.audio.list.RemoveTrackEvent event) {
    dispatchMediaTrackEvent(TrackEventType.REMOVE_TRACK, MediaTrackType.AUDIO, event.getTrack());
  }

  private void onVideoTrackRemove(@NonNull com.theoplayer.android.api.event.track.mediatrack.video.list.RemoveTrackEvent event) {
    dispatchMediaTrackEvent(TrackEventType.REMOVE_TRACK, MediaTrackType.VIDEO, event.getTrack());
  }

  private void onAudioTrackChange(@NonNull com.theoplayer.android.api.event.track.mediatrack.audio.list.TrackListChangeEvent event) {
    dispatchMediaTrackEvent(TrackEventType.CHANGE_TRACK, MediaTrackType.AUDIO, event.getTrack());
  }

  private void onVideoTrackChange(@NonNull com.theoplayer.android.api.event.track.mediatrack.video.list.TrackListChangeEvent event) {
    dispatchMediaTrackEvent(TrackEventType.CHANGE_TRACK, MediaTrackType.VIDEO, event.getTrack());
  }

  public void onFullscreenWillPresent() {
    receiveEvent(EVENT_FULLSCREEN_WILL_PRESENT, null);
  }

  public void onFullscreenDidPresent() {
    receiveEvent(EVENT_FULLSCREEN_DID_PRESENT, null);
  }

  public void onFullscreenWillDismiss() {
    receiveEvent(EVENT_FULLSCREEN_WILL_DISMISS, null);
  }

  public void onFullscreenDidDismiss() {
    receiveEvent(EVENT_FULLSCREEN_DID_DISMISS, null);
  }

  private void receiveEvent(@VideoEvents String type, WritableMap event) {
    if (BuildConfig.LOG_PLAYER_EVENTS) {
      try {
        Log.d(TAG, "receiveEvent " + type + " " + event);
      } catch (RuntimeException ignore) {
      }
    }
    eventEmitter.receiveEvent(viewId, type, event);
  }

  public void attachListeners(@NonNull Player player) {
    // Attach player listeners
    for (Map.Entry<EventType, EventListener> entry : playerListeners.entrySet()) {
      player.addEventListener(entry.getKey(), entry.getValue());
    }

    // Attach text track listeners
    for (Map.Entry<EventType, EventListener> entry : textTrackListeners.entrySet()) {
      player.getTextTracks().addEventListener(entry.getKey(), entry.getValue());
    }

    // Attach audio track listeners
    for (Map.Entry<EventType, EventListener> entry : audioTrackListeners.entrySet()) {
      player.getAudioTracks().addEventListener(entry.getKey(), entry.getValue());
    }

    // Attach video track listeners
    for (Map.Entry<EventType, EventListener> entry : videoTrackListeners.entrySet()) {
      player.getVideoTracks().addEventListener(entry.getKey(), entry.getValue());
    }

    // Attach AdStateHolder
    if (BuildConfig.EXTENSION_ADS) {
      adEventAdapter = new AdEventAdapter(playerView.getAdsApi(), payload -> receiveEvent(EVENT_AD_EVENT, payload));
    }

    if (BuildConfig.EXTENSION_CAST && playerView.getCastApi() != null) {
      castEventAdapter = new CastEventAdapter(playerView.getCastApi(), payload -> receiveEvent(EVENT_CAST_EVENT, payload));
    }
  }

  public void removeListeners(@NonNull Player player) {
    // Remove player listeners
    for (Map.Entry<EventType, EventListener> entry : playerListeners.entrySet()) {
      player.removeEventListener(entry.getKey(), entry.getValue());
    }

    // Remove text track listeners
    for (Map.Entry<EventType, EventListener> entry : textTrackListeners.entrySet()) {
      player.getTextTracks().removeEventListener(entry.getKey(), entry.getValue());
    }

    // Remove audio track listeners
    for (Map.Entry<EventType, EventListener> entry : audioTrackListeners.entrySet()) {
      player.getAudioTracks().removeEventListener(entry.getKey(), entry.getValue());
    }

    // Remove video track listeners
    for (Map.Entry<EventType, EventListener> entry : videoTrackListeners.entrySet()) {
      player.getVideoTracks().removeEventListener(entry.getKey(), entry.getValue());
	}

    if (castEventAdapter != null) {
      castEventAdapter.destroy();
    }

    if (adEventAdapter != null) {
      adEventAdapter.destroy();
    }
  }
}
