package com.theoplayer;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.gson.Gson;
import com.theoplayer.android.api.error.ErrorCode;
import com.theoplayer.android.api.error.THEOplayerException;
import com.theoplayer.android.api.event.ads.AdIntegrationKind;
import com.theoplayer.android.api.player.track.texttrack.TextTrackKind;
import com.theoplayer.android.api.source.GoogleDaiTypedSource;
import com.theoplayer.android.api.source.SourceDescription;
import com.theoplayer.android.api.source.SourceType;
import com.theoplayer.android.api.source.TextTrackDescription;
import com.theoplayer.android.api.source.TypedSource;
import com.theoplayer.android.api.source.addescription.AdDescription;
import com.theoplayer.android.api.source.addescription.GoogleImaAdDescription;
import com.theoplayer.android.api.source.drm.DRMConfiguration;
import com.theoplayer.android.api.source.hls.HlsPlaybackConfiguration;
import com.theoplayer.android.api.source.ssai.SsaiIntegration;
import com.theoplayer.android.api.source.ssai.YoSpaceDescription;
import com.theoplayer.android.api.source.ssai.dai.GoogleDaiLiveConfiguration;
import com.theoplayer.android.api.source.ssai.dai.GoogleDaiVodConfiguration;
import com.theoplayer.drm.ContentProtectionAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Source parsing helper class, because we don't support GSON object deserialization currently
 */
public class SourceHelper {

  private static final String PROP_CONTENT_PROTECTION = "contentProtection";
  private static final String PROP_LIVE_OFFSET = "liveOffset";
  private static final String PROP_HLS_DATERANGE = "hlsDateRange";
  private static final String PROP_HLS_PLAYBACK_CONFIG = "hls";
  private static final String PROP_TIME_SERVER = "timeServer";
  public static final String PROP_SSAI = "ssai";
  public static final String PROP_TYPE = "type";
  public static final String PROP_SRC = "src";
  public static final String PROP_SOURCES = "sources";
  public static final String PROP_DEFAULT = "default";
  public static final String PROP_LABEL = "label";
  public static final String PROP_KIND = "kind";
  public static final String PROP_TIME_OFFSET = "timeOffset";
  public static final String PROP_INTEGRATION = "integration";
  public static final String PROP_TEXT_TRACKS = "textTracks";
  public static final String PROP_POSTER = "poster";
  public static final String PROP_ADS = "ads";
  public static final String PROP_AVAILABILITY_TYPE = "availabilityType";

  private static final String ERROR_DAI_NOT_ENABLED = "Google DAI support not enabled.";
  private static final String ERROR_UNSUPPORTED_SSAI_INTEGRATION = "Unsupported SSAI integration";
  private static final String ERROR_MISSING_SSAI_INTEGRATION = "Missing SSAI integration";
  private static final String ERROR_IMA_NOT_ENABLED = "Google IMA support not enabled.";
  private static final String ERROR_UNSUPPORTED_CSAI_INTEGRATION = "Unsupported CSAI integration";
  private static final String ERROR_MISSING_CSAI_INTEGRATION = "Missing CSAI integration";

  private final Gson gson = new Gson();

  public SourceDescription parseSourceFromJS(ReadableMap source) throws THEOplayerException {
      HashMap<String, Object> hashmap = eliminateReadables(source);
      try {
        String json = gson.toJson(hashmap);
        JSONObject jsonSourceObject = new JSONObject(json);

        // typed sources
        ArrayList<TypedSource> typedSources = new ArrayList<>();

        // sources can be an array or single object
        JSONArray jsonSources = jsonSourceObject.optJSONArray(PROP_SOURCES);
        if (jsonSources != null) {
          for (int i = 0 ; i < jsonSources.length(); i++) {
            TypedSource typedSource = parseTypedSource((JSONObject)jsonSources.get(i));
            if (typedSource != null) {
              typedSources.add(typedSource);
            }
          }
        } else {
          TypedSource typedSource = parseTypedSource(jsonSourceObject.getJSONObject(PROP_SOURCES));
          if (typedSource != null) {
            typedSources.add(typedSource);
          }
        }

        // poster
        String poster = jsonSourceObject.optString(PROP_POSTER);

        // ads
        JSONArray jsonAds = jsonSourceObject.optJSONArray(PROP_ADS);
        ArrayList<AdDescription> ads = new ArrayList<>();
        if (jsonAds != null) {
          for (int i = 0 ; i < jsonAds.length(); i++) {
            JSONObject jsonAdDescription = (JSONObject) jsonAds.get(i);

            // Currently only ima-ads are supported.
            ads.add(parseAdFromJS(jsonAdDescription));
          }
        }

        // Side-loaded text tracks
        JSONArray textTracks = jsonSourceObject.optJSONArray(PROP_TEXT_TRACKS);
        ArrayList<TextTrackDescription> sideLoadedTextTracks = new ArrayList<>();
        if (textTracks != null) {
          for (int i = 0 ; i < textTracks.length(); i++) {
            JSONObject jsonTextTrack = (JSONObject) textTracks.get(i);
            sideLoadedTextTracks.add(parseTextTrackFromJS(jsonTextTrack));
          }
        }

        return SourceDescription.Builder.sourceDescription(typedSources.toArray(new TypedSource[]{}))
          .poster(poster)
          .ads(ads.toArray(new AdDescription[]{}))
          .textTracks(sideLoadedTextTracks.toArray(new TextTrackDescription[]{}))
          .build();
      } catch (JSONException e) {
        e.printStackTrace();
      }

      return null;
  }

  @Nullable
  private TypedSource parseTypedSource(@NonNull final JSONObject jsonTypedSource) throws THEOplayerException {
    try {
      TypedSource.Builder tsBuilder = TypedSource.Builder.typedSource();
      SourceType sourceType = parseSourceType(jsonTypedSource);

      if (jsonTypedSource.has(PROP_SSAI)) {
        final JSONObject ssaiJson = jsonTypedSource.getJSONObject(PROP_SSAI);

        // Check for valid SsaiIntegration
        final String ssaiIntegrationStr = ssaiJson.optString(PROP_INTEGRATION);
        if (!TextUtils.isEmpty(ssaiIntegrationStr)) {
          SsaiIntegration ssaiIntegration = SsaiIntegration.from(ssaiIntegrationStr);
          if (ssaiIntegration == null) {
            throw new THEOplayerException(ErrorCode.AD_ERROR, ERROR_UNSUPPORTED_SSAI_INTEGRATION + ": " + ssaiIntegrationStr);
          }
          switch (ssaiIntegration) {
            case GOOGLE_DAI:
              if (!BuildConfig.EXTENSION_GOOGLE_DAI) {
                throw new THEOplayerException(ErrorCode.AD_ERROR, ERROR_DAI_NOT_ENABLED);
              }
              if (ssaiJson.optString(PROP_AVAILABILITY_TYPE).equals("vod")) {
                tsBuilder = new GoogleDaiTypedSource.Builder(gson.fromJson(ssaiJson.toString(), GoogleDaiVodConfiguration.class));
              } else {
                tsBuilder = new GoogleDaiTypedSource.Builder(gson.fromJson(ssaiJson.toString(), GoogleDaiLiveConfiguration.class));
              }
              // Prefer DASH if not SSAI type specified
              if (sourceType == null) {
                tsBuilder.type(SourceType.DASH);
              }
              break;
            case YOSPACE:
              tsBuilder.ssai(gson.fromJson(ssaiJson.toString(), YoSpaceDescription.class));
              break;
            default:
              throw new THEOplayerException(ErrorCode.AD_ERROR, ERROR_UNSUPPORTED_SSAI_INTEGRATION + ": " + ssaiIntegrationStr);
          }
        } else {
          throw new THEOplayerException(ErrorCode.AD_ERROR, ERROR_MISSING_SSAI_INTEGRATION);
        }
      }
      tsBuilder.src(jsonTypedSource.optString(PROP_SRC));
      if (sourceType != null) {
        tsBuilder.type(sourceType);
      }
      if (jsonTypedSource.has(PROP_LIVE_OFFSET)) {
        tsBuilder.liveOffset(jsonTypedSource.getDouble(PROP_LIVE_OFFSET));
      }
      if (jsonTypedSource.has(PROP_HLS_DATERANGE)) {
        tsBuilder.hlsDateRange(jsonTypedSource.getBoolean(PROP_HLS_DATERANGE));
      }
      if (jsonTypedSource.has(PROP_HLS_PLAYBACK_CONFIG)) {
        HlsPlaybackConfiguration hlsConfig =
          gson.fromJson(jsonTypedSource.get(PROP_HLS_PLAYBACK_CONFIG).toString(), HlsPlaybackConfiguration.class);
        tsBuilder.hls(hlsConfig);
      }
      if (jsonTypedSource.has(PROP_TIME_SERVER)) {
        tsBuilder.timeServer(jsonTypedSource.getString(PROP_TIME_SERVER));
      }
      if (jsonTypedSource.has(PROP_CONTENT_PROTECTION)) {
        DRMConfiguration drmConfig =
          ContentProtectionAdapter.INSTANCE.drmConfigurationFromJson(jsonTypedSource.getJSONObject(PROP_CONTENT_PROTECTION));
        if (drmConfig != null) {
          tsBuilder.drm(drmConfig);
        }
      }
      return tsBuilder.build();
    } catch (JSONException e) {
      e.printStackTrace();
    }
    return null;
  }

  private static SourceType parseSourceType(@NonNull final JSONObject jsonTypedSource) {
    String type = jsonTypedSource.optString(PROP_TYPE);
    if (!type.isEmpty()) {
      if ("application/dash+xml".equals(type)) {
        return SourceType.DASH;
      }
      if ("application/x-mpegurl".equals(type)) {
        return SourceType.HLSX;
      }
      if ("application/vnd.theo.hesp+json".equals(type)) {
        return SourceType.HESP;
      }
      if ("application/vnd.apple.mpegurl".equals(type)) {
        return SourceType.HLS;
      }
      if ("video/mp4".equals(type)) {
        return SourceType.MP4;
      }
      if ("audio/mpeg".equals(type)) {
        return SourceType.MP3;
      }
    } else {
      // No type given, check for known extension.
      String src = jsonTypedSource.optString(PROP_SRC);
      if (src.endsWith(".mpd")) {
        return SourceType.DASH;
      }
      if (src.endsWith(".m3u8")) {
        return SourceType.HLSX;
      }
      if (src.endsWith(".mp4")) {
        return SourceType.MP4;
      }
      if (src.endsWith(".mp3")) {
        return SourceType.MP3;
      }
    }
    return null;
  }

  @Nullable
  public AdDescription parseAdFromJS(ReadableMap map) throws THEOplayerException {
    HashMap<String, Object> hashmap = eliminateReadables(map);
    try {
      JSONObject jsonAdDescription = new JSONObject(gson.toJson(hashmap));
      return parseAdFromJS(jsonAdDescription);
    } catch(JSONException e) {
      e.printStackTrace();
      return null;
    }
  }

  @NonNull
  public static AdDescription parseAdFromJS(JSONObject jsonAdDescription) throws JSONException, THEOplayerException {
    final String integrationKindStr = jsonAdDescription.optString(PROP_INTEGRATION);
    if (!TextUtils.isEmpty(integrationKindStr)) {
      AdIntegrationKind integrationKind = AdIntegrationKind.from(integrationKindStr);
      switch (integrationKind) {
        // Currently only IMA is supported.
        case GOOGLE_IMA:
          return parseImaAdFromJS(jsonAdDescription);
        case DEFAULT:
        case THEO:
        case FREEWHEEL:
        case SPOTX:
        default: {
          throw new THEOplayerException(ErrorCode.AD_ERROR, ERROR_UNSUPPORTED_CSAI_INTEGRATION + ": " + integrationKindStr);
        }
      }
    } else {
      throw new THEOplayerException(ErrorCode.AD_ERROR, ERROR_MISSING_CSAI_INTEGRATION + ": " + integrationKindStr);
    }
  }

  @NonNull
  private static GoogleImaAdDescription parseImaAdFromJS(JSONObject jsonAdDescription) throws THEOplayerException {
    if (!BuildConfig.EXTENSION_GOOGLE_IMA) {
      throw new THEOplayerException(ErrorCode.AD_ERROR, ERROR_IMA_NOT_ENABLED);
    }
    String source;
    // Property `sources` is of type string | AdSource.
    JSONObject sourceObj = jsonAdDescription.optJSONObject(PROP_SOURCES);
    if (sourceObj != null) {
      source = sourceObj.optString(PROP_SRC);
    } else {
      source = jsonAdDescription.optString(PROP_SOURCES);
    }
    return GoogleImaAdDescription.Builder.googleImaAdDescription()
      .source(source)
      .timeOffset(jsonAdDescription.optString(PROP_TIME_OFFSET))
      .build();
  }

  private static TextTrackDescription parseTextTrackFromJS(JSONObject jsonTextTrack) throws JSONException {
    TextTrackDescription.Builder builder = TextTrackDescription.Builder.textTrackDescription()
      .isDefault(jsonTextTrack.optBoolean(PROP_DEFAULT))
      .src(jsonTextTrack.optString(PROP_SRC))
      .label(jsonTextTrack.optString(PROP_LABEL))
      .kind(parseTextTrackKind(jsonTextTrack.optString(PROP_KIND)));
    return builder.build();
  }

  private static TextTrackKind parseTextTrackKind(String kind) {
    if (kind == null) {
      return null;
    }
    switch (kind) {
      case "subtitles": return TextTrackKind.SUBTITLES;
      case "metadata": return TextTrackKind.METADATA;
      case "captions": return TextTrackKind.CAPTIONS;
      case "chapters": return TextTrackKind.CHAPTERS;
      case "descriptions": return TextTrackKind.DESCRIPTIONS;
    }
    return null;
  }

  /**
   * Eliminate all the Readable* classes from the map.
   */
  protected static HashMap<String, Object> eliminateReadables(ReadableMap readableMap) {
    HashMap<String, Object> hashMap = readableMap.toHashMap();
    HashMap<String, Object> eliminatedHashMap = new HashMap<>();

    for (Map.Entry<String, Object> entry : hashMap.entrySet()) {
      Object value = entry.getValue();
      if (value instanceof ReadableMap) {
        value = eliminateReadables((ReadableMap) value);
      } else if (value instanceof ReadableArray) {
        value = eliminateReadables((ReadableArray) value);
      }
      eliminatedHashMap.put(entry.getKey(), value);
    }
    return eliminatedHashMap;
  }

  /**
   * Eliminate all the Readable* classes from the array.
   */
  protected static ArrayList<Object> eliminateReadables(ReadableArray readableArray) {
    ArrayList<Object> arrayList = readableArray.toArrayList();
    ArrayList<Object> eliminatedArrayList = new ArrayList<>();

    for (Object o : arrayList) {
      Object value = o;

      if (value instanceof ReadableMap) {
        value = eliminateReadables((ReadableMap) value);
      } else if (value instanceof ReadableArray) {
        value = eliminateReadables((ReadableArray) value);
      }

      eliminatedArrayList.add(value);
    }

    return eliminatedArrayList;
  }
}
