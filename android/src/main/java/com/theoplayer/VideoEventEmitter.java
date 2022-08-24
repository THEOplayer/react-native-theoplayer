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
import androidx.annotation.StringDef;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.theoplayer.ads.AdInfo;
import com.theoplayer.android.api.ads.Ad;
import com.theoplayer.android.api.ads.ima.GoogleImaAdEvent;
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType;
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
import com.theoplayer.android.api.event.track.texttrack.AddCueEvent;
import com.theoplayer.android.api.event.track.texttrack.RemoveCueEvent;
import com.theoplayer.android.api.event.track.texttrack.TextTrackEventTypes;
import com.theoplayer.android.api.event.track.texttrack.list.AddTrackEvent;
import com.theoplayer.android.api.event.track.texttrack.list.RemoveTrackEvent;
import com.theoplayer.android.api.event.track.texttrack.list.TextTrackListEventTypes;
import com.theoplayer.android.api.player.Player;
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack;
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality;
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality;
import com.theoplayer.android.api.player.track.texttrack.TextTrack;
import com.theoplayer.track.TextTrackCueEventType;
import com.theoplayer.track.TrackEventType;
import com.theoplayer.util.TypeUtils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

class VideoEventEmitter {

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
  private static final String EVENT_AD_EVENT = "onNativeAdEvent";
  private static final String EVENT_FULLSCREEN_WILL_PRESENT = "onNativeFullscreenPlayerWillPresent";
  private static final String EVENT_FULLSCREEN_DID_PRESENT = "onNativeFullscreenPlayerDidPresent";
  private static final String EVENT_FULLSCREEN_WILL_DISMISS = "onNativeFullscreenPlayerWillDismiss";
  private static final String EVENT_FULLSCREEN_DID_DISMISS = "onNativeFullscreenPlayerDidDismiss";

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
    EVENT_AD_EVENT,
    EVENT_FULLSCREEN_WILL_PRESENT,
    EVENT_FULLSCREEN_DID_PRESENT,
    EVENT_FULLSCREEN_WILL_DISMISS,
    EVENT_FULLSCREEN_DID_DISMISS,
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
    EVENT_AD_EVENT,
    EVENT_FULLSCREEN_WILL_PRESENT,
    EVENT_FULLSCREEN_DID_PRESENT,
    EVENT_FULLSCREEN_WILL_DISMISS,
    EVENT_FULLSCREEN_DID_DISMISS
  })
  @interface VideoEvents {
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
  private static final String EVENT_PROP_CUE = "cue";
  private static final String EVENT_PROP_TYPE = "type";
  private static final String EVENT_PROP_AD = "ad";

  private final RCTEventEmitter eventEmitter;
  private int viewId = View.NO_ID;
  private final HashMap<EventType, EventListener> playerListeners = new HashMap<>();
  private final HashMap<EventType, EventListener> textTrackListeners = new HashMap<>();
  private final HashMap<EventType, EventListener> adListeners = new HashMap<>();

  private final ReactTHEOplayerView playerView;

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

    adListeners.put(GoogleImaAdEventType.LOADED, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.AD_BREAK_STARTED, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.STARTED, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.FIRST_QUARTILE, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.MIDPOINT, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.THIRD_QUARTILE, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.COMPLETED, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.AD_BREAK_ENDED, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.SKIPPED, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.AD_ERROR, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.AD_BUFFERING, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
    adListeners.put(GoogleImaAdEventType.AD_BREAK_FETCH_ERROR, (EventListener<GoogleImaAdEvent>) this::onAdEvent);
  }

  public void setViewId(int viewId) {
    this.viewId = viewId;
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
    if (player != null && !player.getAds().isPlaying()) {
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
    WritableMap error = Arguments.createMap();
    final THEOplayerException exception = event.getErrorObject();
    error.putString(EVENT_PROP_ERROR_CODE, exception.getCode().name());
    error.putString(EVENT_PROP_ERROR_MESSAGE, exception.getMessage());
    WritableMap payload = Arguments.createMap();
    payload.putMap(EVENT_PROP_ERROR, error);
    receiveEvent(EVENT_ERROR, payload);
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

  private void onTextTrackAdd(@NonNull AddTrackEvent event) {
    WritableMap payload = Arguments.createMap();
    TextTrack textTrack = event.getTrack();
    payload.putMap(EVENT_PROP_TRACK, playerView.getTextTrackInfo(textTrack));
    payload.putInt(EVENT_PROP_TYPE, TrackEventType.ADD_TRACK.type);
    textTrack.addEventListener(TextTrackEventTypes.ADDCUE, this::onTextTrackAddCue);
    textTrack.addEventListener(TextTrackEventTypes.REMOVECUE, this::onTextTrackRemoveCue);
    receiveEvent(EVENT_TEXTTRACK_LIST_EVENT, payload);
  }

  private void onTextTrackRemove(@NonNull RemoveTrackEvent event) {
    WritableMap payload = Arguments.createMap();
    TextTrack textTrack = event.getTrack();
    payload.putMap(EVENT_PROP_TRACK, playerView.getTextTrackInfo(textTrack));
    payload.putInt(EVENT_PROP_TYPE, TrackEventType.REMOVE_TRACK.type);
    textTrack.removeEventListener(TextTrackEventTypes.ADDCUE, this::onTextTrackAddCue);
    textTrack.removeEventListener(TextTrackEventTypes.REMOVECUE, this::onTextTrackRemoveCue);
    receiveEvent(EVENT_TEXTTRACK_LIST_EVENT, payload);
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

  private void onAdEvent(@NonNull GoogleImaAdEvent event) {
    WritableMap payload = Arguments.createMap();
    String type;
    switch ((GoogleImaAdEventType)event.getType()) {
      case LOADED: type = "adloaded"; break;
      case AD_BREAK_STARTED: type = "adbreakbegin"; break;
      case STARTED: type = "adbegin"; break;
      case FIRST_QUARTILE: type = "adfirstquartile"; break;
      case MIDPOINT: type = "admidpoint"; break;
      case THIRD_QUARTILE: type = "adthirdquartile"; break;
      case COMPLETED: type = "adend"; break;
      case SKIPPED: type = "adskip"; break;
      case AD_BREAK_ENDED: type = "adbreakend"; break;
      case AD_ERROR: type = "aderror"; break;
      case AD_BUFFERING: type = "adbuffering"; break;
      case AD_BREAK_FETCH_ERROR: type = "aderror"; break;
      default: type = event.getType().getName().toLowerCase();
    }
    payload.putString(EVENT_PROP_TYPE, type);
    Ad ad = event.getAd();
    if (ad != null) {
      payload.putMap(EVENT_PROP_AD, AdInfo.fromAd(ad));
    }
    receiveEvent(EVENT_AD_EVENT, payload);
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

    // Attach ad listeners
    for (Map.Entry<EventType, EventListener> entry : adListeners.entrySet()) {
      player.getAds().addEventListener(entry.getKey(), entry.getValue());
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

    // Remove ad listeners
    for (Map.Entry<EventType, EventListener> entry : adListeners.entrySet()) {
      player.getAds().removeEventListener(entry.getKey(), entry.getValue());
    }
  }
}
