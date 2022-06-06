package com.theoplayer;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class ReactTHEOplayerViewManager extends ViewGroupManager<ReactTHEOplayerView> {
  public static final String REACT_CLASS = "THEOplayerRCTView";

  private static final String PROP_CONFIG = "config";
  private static final String PROP_SRC = "src";
  private static final String PROP_SEEK = "seek";
  private static final String PROP_PAUSED = "paused";
  private static final String PROP_MUTED = "muted";
  private static final String PROP_VOLUME = "volume";
  private static final String PROP_PLAYBACKRATE = "playbackRate";
  private static final String PROP_FULLSCREEN = "fullscreen";
  private static final String PROP_SELECTED_TEXTTRACK = "selectedTextTrack";
  private static final String PROP_SELECTED_AUDIOTRACK = "selectedAudioTrack";
  private static final String PROP_SELECTED_VIDEOTRACK = "selectedVideoTrack";

  @Override
  @NonNull
  public String getName() {
    return REACT_CLASS;
  }

  @NonNull
  @Override
  protected ReactTHEOplayerView createViewInstance(@NonNull ThemedReactContext reactContext) {
    return new ReactTHEOplayerView(reactContext);
  }

  @Override
  public void onDropViewInstance(ReactTHEOplayerView view) {
    view.cleanUpResources();
  }

  @ReactProp(name = PROP_CONFIG)
  public void setConfig(final ReactTHEOplayerView videoView, @Nullable ReadableMap config) {
    videoView.initialize(config);
  }

  @ReactProp(name = PROP_SRC)
  public void setSource(final ReactTHEOplayerView videoView, @Nullable ReadableMap src) {
    videoView.setSource(new SourceHelper().parseSourceFromJS(src));
  }

  @ReactProp(name = PROP_SEEK)
  public void setSeek(final ReactTHEOplayerView videoView, final double seek) {
    videoView.seekTo(seek);
  }

  @ReactProp(name = PROP_PAUSED, defaultBoolean = false)
  public void setPaused(final ReactTHEOplayerView videoView, final boolean paused) {
    videoView.setPaused(paused);
  }

  @ReactProp(name = PROP_MUTED, defaultBoolean = false)
  public void setMuted(final ReactTHEOplayerView videoView, final boolean muted) {
    videoView.setMuted(muted);
  }

  @ReactProp(name = PROP_VOLUME, defaultDouble = 1.0)
  public void setVolume(final ReactTHEOplayerView videoView, final double volume) {
    videoView.setVolume(volume);
  }

  @ReactProp(name = PROP_PLAYBACKRATE, defaultDouble = 1.0)
  public void setPlaybackRate(final ReactTHEOplayerView videoView, final double playbackRate) {
    videoView.setPlaybackRate(playbackRate);
  }

  @ReactProp(name = PROP_FULLSCREEN, defaultBoolean = false)
  public void setFullscreen(final ReactTHEOplayerView videoView, final boolean fullscreen) {
    videoView.setFullscreen(fullscreen);
  }

  @ReactProp(name = PROP_SELECTED_TEXTTRACK, defaultInt = -1)
  public void setSelectedTextTrack(final ReactTHEOplayerView videoView, final int uid) {
    videoView.setSelectedTextTrack(uid);
  }

  @ReactProp(name = PROP_SELECTED_AUDIOTRACK, defaultInt = -1)
  public void setSelectedAudioTrack(final ReactTHEOplayerView videoView, final int uid) {
    if (uid != -1) {
      videoView.setSelectedAudioTrack(uid);
    }
  }

  @ReactProp(name = PROP_SELECTED_VIDEOTRACK, defaultInt = -1)
  public void setSelectedVideoTrack(final ReactTHEOplayerView videoView, final int uid) {
    if (uid != -1) {
      videoView.setSelectedVideoTrack(uid);
    }
  }

  @Override
  public @Nullable
  Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
    for (String event : VideoEventEmitter.Events) {
      builder.put(event, MapBuilder.of("registrationName", event));
    }
    return builder.build();
  }
}
