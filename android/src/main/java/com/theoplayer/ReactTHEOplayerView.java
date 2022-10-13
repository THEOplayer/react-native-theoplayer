package com.theoplayer;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Build;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.ads.interactivemedia.v3.api.AdsRenderingSettings;
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory;
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegration;
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegrationFactory;
import com.theoplayer.abr.ABRConfigurationAdapter;
import com.theoplayer.android.api.THEOplayerConfig;
import com.theoplayer.android.api.THEOplayerView;
import com.theoplayer.android.api.ads.ima.GoogleImaIntegration;
import com.theoplayer.android.api.ads.ima.GoogleImaIntegrationFactory;
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper;
import com.theoplayer.android.api.cast.CastIntegration;
import com.theoplayer.android.api.cast.CastIntegrationFactory;
import com.theoplayer.android.api.error.THEOplayerException;
import com.theoplayer.android.api.player.Player;
import com.theoplayer.android.api.player.RequestCallback;
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack;
import com.theoplayer.android.api.player.track.mediatrack.MediaTrackList;
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality;
import com.theoplayer.android.api.player.track.mediatrack.quality.QualityList;
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality;
import com.theoplayer.android.api.player.track.texttrack.TextTrack;
import com.theoplayer.android.api.player.track.texttrack.TextTrackList;
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode;
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCue;
import com.theoplayer.android.api.source.SourceDescription;
import com.theoplayer.android.api.timerange.TimeRanges;
import com.theoplayer.track.QualityListFilter;
import com.theoplayer.track.TrackListInfo;
import com.theoplayer.util.TypeUtils;

import java.util.Collections;

@SuppressLint("ViewConstructor")
public class ReactTHEOplayerView extends FrameLayout implements LifecycleEventListener {

  private static final String TAG = ReactTHEOplayerView.class.getName();

  public static final long TIME_UNSET = Long.MIN_VALUE + 1;

  private final VideoEventEmitter eventEmitter;

  private final ThemedReactContext reactContext;

  private THEOplayerView playerView;

  private GoogleDaiIntegration daiIntegration;

  private GoogleImaIntegration imaIntegration;

  private CastIntegration castIntegration;

  private final AdsApiWrapper adsApi;

  private Player player;
  private ReadableMap abrConfig;
  private boolean paused;
  private boolean muted = false;
  private boolean fullscreen = false;
  private double playbackRate = 1.0;
  private double volume = 1.0;
  private double seekTime = TIME_UNSET;
  private SourceDescription sourceDescription;
  private final Handler handler = new Handler();

  public ReactTHEOplayerView(ThemedReactContext context) {
    super(context);
    this.reactContext = context;
    this.eventEmitter = new VideoEventEmitter(context, this);
    reactContext.addLifecycleEventListener(this);
    adsApi = new AdsApiWrapper();
  }

  public void initialize(@Nullable ReadableMap configProps) {
    createViews(new PlayerConfigAdapter().fromProps(configProps));
  }

  @Nullable
  public GoogleDaiIntegration getDaiIntegration() {
    return daiIntegration;
  }

  @Nullable
  public CastIntegration getCastIntegration() {
    return castIntegration;
  }

  @NonNull
  public WritableArray getTextTrackInfo() {
    if (player != null) {
      return TrackListInfo.fromTextTrackList(player.getTextTracks());
    }
    return Arguments.createArray();
  }

  @NonNull
  public WritableMap getTextTrackInfo(TextTrack track) {
    if (player != null) {
      return TrackListInfo.fromTextTrack(track);
    }
    return Arguments.createMap();
  }

  @NonNull
  public WritableMap getTextTrackCueInfo(TextTrackCue cue) {
    if (player != null) {
      return TrackListInfo.fromTextTrackCue(cue);
    }
    return Arguments.createMap();
  }

  @NonNull
  public WritableArray getAudioTrackInfo() {
    if (player != null) {
      return TrackListInfo.fromAudioTrackList(player.getAudioTracks());
    }
    return Arguments.createArray();
  }

  @NonNull
  public WritableArray getVideoTrackInfo() {
    if (player != null) {
      return TrackListInfo.fromVideoTrackList(player.getVideoTracks());
    }
    return Arguments.createArray();
  }

  public double getDuration() {
    return TypeUtils.INSTANCE.encodeInfNan(player != null? 1e03 * player.getDuration() : Double.NaN);
  }

  public void getSeekableRange(RequestCallback<TimeRanges> callback) {
    if (player != null) {
      player.requestSeekable(callback);
    } else {
      callback.handleResult(null);
    }
  }

  public void getBufferedRange(RequestCallback<TimeRanges> callback) {
    if (player != null) {
      player.requestBuffered(callback);
    } else {
      callback.handleResult(null);
    }
  }

  @Override
  public void setId(int id) {
    super.setId(id);
    eventEmitter.setViewId(id);
  }

  private void createViews(@NonNull THEOplayerConfig playerConfig) {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "Create views");
    }

    LayoutParams layoutParams = new LayoutParams(
      LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT);

    playerView = new THEOplayerView(reactContext.getCurrentActivity(), playerConfig) {
      private void measureAndLayout() {
        measure(
          View.MeasureSpec.makeMeasureSpec(getMeasuredWidth(), View.MeasureSpec.EXACTLY),
          View.MeasureSpec.makeMeasureSpec(getMeasuredHeight(), View.MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
      }

      @Override
      public void requestLayout() {
        super.requestLayout();

        // schedule a forced layout
        handler.post(this::measureAndLayout);
      }
    };
    playerView.setLayoutParams(layoutParams);

    addView(playerView, 0, layoutParams);
    addIntegrations(playerView, playerConfig);
  }

  private void addIntegrations(@NonNull final THEOplayerView playerView, @NonNull THEOplayerConfig playerConfig) {
    try {
      if (BuildConfig.EXTENSION_GOOGLE_IMA) {
        imaIntegration = GoogleImaIntegrationFactory.createGoogleImaIntegration(playerView);
        imaIntegration.setAdsRenderingSettings(createRenderSettings(playerConfig));
        playerView.getPlayer().addIntegration(imaIntegration);
      }
    } catch (Exception ignore) {
    }
    try {
      if (BuildConfig.EXTENSION_GOOGLE_DAI) {
        daiIntegration = GoogleDaiIntegrationFactory.createGoogleDaiIntegration(playerView);
        daiIntegration.setAdsRenderingSettings(createRenderSettings(playerConfig));
        playerView.getPlayer().addIntegration(daiIntegration);
      }
    } catch (Exception ignore) {
    }
    try {
      if (BuildConfig.EXTENSION_CAST) {
        castIntegration = CastIntegrationFactory.createCastIntegration(playerView);
        playerView.getPlayer().addIntegration(castIntegration);
      }
      // Add other future integrations here.
    } catch (Exception ignore) {
    }
  }

  private AdsRenderingSettings createRenderSettings(@NonNull THEOplayerConfig playerConfig) {
    AdsRenderingSettings renderingSettings = ImaSdkFactory.getInstance().createAdsRenderingSettings();
    if (playerConfig.getAds() != null && !playerConfig.getAds().isShowCountdown()) {
      renderingSettings.setUiElements(Collections.emptySet());
      renderingSettings.setDisableUi(true);
    }
    return renderingSettings;
  }

  @Override
  protected void onAttachedToWindow() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onAttachedToWindow");
    }
    super.onAttachedToWindow();
    initializePlayer();
  }

  @Override
  protected void onDetachedFromWindow() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onDetachedFromWindow");
    }
    super.onDetachedFromWindow();
  }

  private void initializePlayer() {
    // This ensures all props have been settled, to avoid async racing conditions.
    new Handler().postDelayed(() -> {
      if (player == null) {
        player = playerView.getPlayer();
        ABRConfigurationAdapter.INSTANCE.applyABRConfigurationFromProps(player, abrConfig);
        if (BuildConfig.EXTENSION_ADS) {
          adsApi.initialize(player, imaIntegration, daiIntegration);
        }
        eventEmitter.attachListeners(player);
        player.setMuted(muted);
        player.setVolume(volume);
        player.setPlaybackRate(playbackRate);

        setSource(sourceDescription);

        if (!this.paused) {
          player.play();
        }

        if (seekTime != TIME_UNSET) {
          seekTo(seekTime);
        }
      }
    }, 1);
  }

  @Nullable
  public Player getPlayer() {
    return player;
  }

  @NonNull
  public AdsApiWrapper getAdsApi() {
    return adsApi;
  }



  @Override
  public void onHostResume() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostResume");
    }
    if (playerView != null) {
      playerView.onResume();
    }
  }

  @Override
  public void onHostPause() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostPause");
    }
    if (playerView != null) {
      playerView.onPause();
    }
  }

  @Override
  public void onHostDestroy() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostDestroy");
    }
    cleanUpResources();
  }

  public void cleanUpResources() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "cleanUpResources");
    }
    releasePlayer();
  }

  private void releasePlayer() {
    if (player != null) {
      eventEmitter.removeListeners(player);

      if (adsApi != null) {
        adsApi.destroy();
      }

      player.stop();
      player = null;
    }

    if (playerView != null) {
      playerView.onDestroy();
    }

    reactContext.removeLifecycleEventListener(this);
  }

  public void setSource(@Nullable final ReadableMap source) {
    try {
      setSource(new SourceHelper().parseSourceFromJS(source));
    } catch (THEOplayerException exception) {
      Log.e(TAG, exception.getMessage());
      eventEmitter.emitError(exception);
    }
  }

  public void setABRConfig(@Nullable ReadableMap abrConfigProps) {
    abrConfig = abrConfigProps;
    ABRConfigurationAdapter.INSTANCE.applyABRConfigurationFromProps(player, abrConfig);
  }

  public void setSource(@Nullable final SourceDescription sourceDescription) {
    this.sourceDescription = sourceDescription;
    if (adsApi != null) {
      adsApi.setSource(sourceDescription);
    }
    if (player != null && sourceDescription != null) {
      player.setSource(sourceDescription);
    }
  }

  public void setPaused(boolean paused) {
    this.paused = paused;
    if (player != null) {
      final boolean playerIsPaused = player.isPaused();
      if (!paused && playerIsPaused) {
        player.play();
      } else if (paused && (!playerIsPaused || adsApi.isPlaying())) {
        player.pause();
      }
    }
  }

  public void setMuted(boolean muted) {
    this.muted = muted;
    if (player != null) {
      player.setMuted(muted);
    }
  }

  public void setVolume(double volume) {
    this.volume = volume;
    if (player != null) {
      player.setVolume(volume);
    }
  }

  public void setPlaybackRate(double playbackRate) {
    this.playbackRate = playbackRate;
    if (player != null) {
      player.setPlaybackRate(playbackRate);
    }
  }

  public void seekTo(double seekTime) {
    this.seekTime = seekTime;
    if (player != null) {
      player.setCurrentTime(1e-03 * seekTime);
      this.seekTime = TIME_UNSET;
    }
  }

  @Nullable
  public TextTrack getSelectedTextTrack() {
    if (player != null) {
      final TextTrackList tracks = player.getTextTracks();
      for (int i = 0; i < tracks.length(); i++) {
        final TextTrack track = tracks.getItem(i);
        if (track.getMode() == TextTrackMode.SHOWING) {
          return track;
        }
      }
    }
    return null;
  }

  public void setSelectedTextTrack(int uid) {
    if (player != null) {
      for (final TextTrack track: player.getTextTracks()) {
        if (track.getUid() == uid) {
          track.setMode(TextTrackMode.SHOWING);
        } else if (track.getMode() == TextTrackMode.SHOWING) {
          track.setMode(TextTrackMode.DISABLED);
        }
      }
    }
  }

  @Nullable
  public MediaTrack<AudioQuality> getSelectedAudioTrack() {
    if (player != null) {
      final MediaTrackList<AudioQuality> tracks = player.getAudioTracks();
      for (int i = 0; i < tracks.length(); i++) {
        final MediaTrack<AudioQuality> track = tracks.getItem(i);
        if (track.isEnabled()) {
          return track;
        }
      }
    }
    return null;
  }

  public void setSelectedAudioTrack(int uid) {
    if (player != null) {
      for (final MediaTrack<AudioQuality> track: player.getAudioTracks()) {
        track.setEnabled(track.getUid() == uid);
      }
    }
  }

  @Nullable
  public MediaTrack<VideoQuality> getSelectedVideoTrack() {
    if (player != null) {
      final MediaTrackList<VideoQuality> tracks = player.getVideoTracks();
      for (int i = 0; i < tracks.length(); i++) {
        final MediaTrack<VideoQuality> track = tracks.getItem(i);
        if (track.isEnabled()) {
          return track;
        }
      }
    }
    return null;
  }

  public void setSelectedVideoTrack(int uid) {
    if (player != null) {
      for (final MediaTrack<VideoQuality> track: player.getVideoTracks()) {
        track.setEnabled(track.getUid() == uid);
      }
    }
  }

  public void setTargetVideoQualities(ReadableArray uids) {
    MediaTrack<VideoQuality> currentVideoTrack = getSelectedVideoTrack();
    if (currentVideoTrack != null) {
      if (uids.size() == 0) {
        // Reset target qualities when passing empty list.
        currentVideoTrack.setTargetQuality(null);
      } else {
        QualityList<VideoQuality> qualities = currentVideoTrack.getQualities();
        if (qualities != null) {
          currentVideoTrack.setTargetQualities(new QualityListFilter<>(qualities).filterQualityList(uids));
        }
      }
    }
  }

  @SuppressLint("ObsoleteSdkInt")
  public void setFullscreen(boolean fullscreen) {
    if (fullscreen == this.fullscreen) {
      return; // Avoid generating events when nothing is changing
    }
    this.fullscreen = fullscreen;

    Activity activity = reactContext.getCurrentActivity();
    if (activity == null) {
      return;
    }
    Window window = activity.getWindow();
    View decorView = window.getDecorView();
    int uiOptions;
    if (fullscreen) {
      if (Build.VERSION.SDK_INT >= 19) { // 4.4+
        uiOptions = SYSTEM_UI_FLAG_HIDE_NAVIGATION
          | SYSTEM_UI_FLAG_IMMERSIVE_STICKY
          | SYSTEM_UI_FLAG_FULLSCREEN;
      } else {
        uiOptions = SYSTEM_UI_FLAG_HIDE_NAVIGATION
          | SYSTEM_UI_FLAG_FULLSCREEN;
      }
      eventEmitter.onFullscreenWillPresent();
      decorView.setSystemUiVisibility(uiOptions);
      eventEmitter.onFullscreenDidPresent();
    } else {
      uiOptions = View.SYSTEM_UI_FLAG_VISIBLE;
      eventEmitter.onFullscreenWillDismiss();
      decorView.setSystemUiVisibility(uiOptions);
      eventEmitter.onFullscreenDidDismiss();
    }
  }
}
