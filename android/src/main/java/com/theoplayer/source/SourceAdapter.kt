package com.theoplayer.source

import android.text.TextUtils
import android.util.Log
import com.google.gson.Gson
import com.theoplayer.android.api.ads.theoads.TheoAdDescription
import com.theoplayer.android.api.error.THEOplayerException
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.api.source.TypedSource
import com.theoplayer.android.api.source.metadata.MetadataDescription
import com.theoplayer.android.api.source.addescription.AdDescription
import com.theoplayer.android.api.source.TextTrackDescription
import com.theoplayer.android.api.source.SourceType
import com.theoplayer.android.api.source.hls.HlsPlaybackConfiguration
import com.theoplayer.android.api.source.addescription.GoogleImaAdDescription
import com.theoplayer.android.api.player.track.texttrack.TextTrackKind
import com.theoplayer.android.api.source.metadata.ChromecastMetadataImage
import com.theoplayer.BuildConfig
import com.theoplayer.android.api.ads.theoads.TheoAdsLayoutOverride
import com.theoplayer.android.api.cmcd.CMCDTransmissionMode
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.source.AdIntegration
import com.theoplayer.android.api.source.PlaybackPipeline
import com.theoplayer.android.api.source.dash.DashPlaybackConfiguration
import com.theoplayer.android.api.theolive.TheoLiveSource
import com.theoplayer.cmcd.CmcdTransmissionMode
import com.theoplayer.drm.ContentProtectionAdapter
import com.theoplayer.latency.parseLatencyConfiguration
import com.theoplayer.util.BridgeUtils
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.util.ArrayList
import java.util.HashMap

private const val TAG = "SourceAdapter"
private const val PROP_CONTENT_PROTECTION = "contentProtection"
private const val PROP_LIVE_OFFSET = "liveOffset"
private const val PROP_HLS_DATERANGE = "hlsDateRange"
private const val PROP_HLS_PLAYBACK_CONFIG = "hls"
private const val PROP_TIME_SERVER = "timeServer"
private const val PROP_DATA = "data"
private const val PROP_METADATA = "metadata"
private const val PROP_SSAI = "ssai"
private const val PROP_TYPE = "type"
private const val PROP_SRC = "src"
private const val PROP_SOURCES = "sources"
private const val PROP_DEFAULT = "default"
private const val PROP_LABEL = "label"
private const val PROP_SRCLANG = "srclang"
private const val PROP_KIND = "kind"
private const val PROP_TIME_OFFSET = "timeOffset"
private const val PROP_INTEGRATION = "integration"
private const val PROP_TEXT_TRACKS = "textTracks"
private const val PROP_POSTER = "poster"
private const val PROP_ADS = "ads"
private const val PROP_DASH = "dash"
private const val PROP_DASH_IGNORE_AVAILABILITYWINDOW = "ignoreAvailabilityWindow"
private const val PROP_HEADERS = "headers"
private const val PROP_AD_TAG_PARAMETERS = "adTagParameters"
private const val PROP_BACKDROP_DOUBLE_BOX = "backdropDoubleBox"
private const val PROP_BACKDROP_LSHAPE = "backdropLShape"
private const val PROP_CUSTOM_ASSET_KEY = "customAssetKey"
private const val PROP_OVERRIDE_LAYOUT = "overrideLayout"
private const val PROP_NETWORK_CODE = "networkCode"
private const val PROP_USE_ID3 = "useId3"
private const val PROP_RETRIEVE_POD_ID_URI = "retrievePodIdURI"
private const val PROP_SSE_ENDPOINT = "sseEndpoint"
private const val PROP_LATENCY_CONFIGURATION = "latencyConfiguration"
private const val PROP_PLAYBACK_PIPELINE = "playbackPipeline"

private const val ERROR_IMA_NOT_ENABLED = "Google IMA support not enabled."
private const val ERROR_THEOADS_NOT_ENABLED = "THEOads support not enabled."
private const val ERROR_UNSUPPORTED_CSAI_INTEGRATION = "Unsupported CSAI integration"
private const val ERROR_MISSING_CSAI_INTEGRATION = "Missing CSAI integration"

private const val PROP_SSAI_INTEGRATION_GOOGLE_DAI = "google-dai"

private const val INTEGRATION_THEOLIVE = "theolive"
private const val TYPE_MILLICAST = "millicast"
private const val PLAYBACK_PIPELINE_LEGACY = "legacy"

private const val PROP_CMCD = "cmcd"
private const val CMCD_TRANSMISSION_MODE = "transmissionMode"

class SourceAdapter {
  private val gson = Gson()

  companion object {
    init {
      // Register default SSAI adapter for Google DAI.
      SSAIAdapterRegistry.register(PROP_SSAI_INTEGRATION_GOOGLE_DAI) { json, currentBuilder ->
        googleDaiBuilderFromJson(currentBuilder, json)
      }
    }
  }

  @Throws(THEOplayerException::class)
  fun parseSourceFromJS(source: ReadableMap?): SourceDescription? {
    if (source == null) {
      return null
    }
    try {
      val jsonSourceObject = JSONObject(gson.toJson(source.toHashMap()))

      // CMCD
      var cmcdTransmissionMode: CMCDTransmissionMode? = null
      if (jsonSourceObject.has(PROP_CMCD)) {
        cmcdTransmissionMode = parseCmcdTransmissionMode(jsonSourceObject.getJSONObject(PROP_CMCD))
      }

      // typed sources
      val typedSources = ArrayList<TypedSource>()

      // sources can be an array or single object
      val jsonSources = jsonSourceObject.optJSONArray(PROP_SOURCES)
      if (jsonSources != null) {
        for (i in 0 until jsonSources.length()) {
          typedSources.add(parseTypedSource(jsonSources[i] as JSONObject, cmcdTransmissionMode))
        }
      } else {
        val jsonSource = jsonSourceObject.optJSONObject(PROP_SOURCES) ?: return null
        typedSources.add(parseTypedSource(jsonSource, cmcdTransmissionMode))
      }

      // poster
      val poster = jsonSourceObject.optString(PROP_POSTER)

      // metadata
      var metadataDescription: MetadataDescription? = null
      val jsonMetadata = jsonSourceObject.optJSONObject(PROP_METADATA)
      if (jsonMetadata != null) {
        metadataDescription = parseMetadataDescription(jsonMetadata)
      }

      // ads
      val jsonAds = jsonSourceObject.optJSONArray(PROP_ADS)
      val ads = ArrayList<AdDescription>()
      if (jsonAds != null) {
        for (i in 0 until jsonAds.length()) {
          val jsonAdDescription = jsonAds[i] as JSONObject

          // Currently only ima-ads are supported.
          ads.add(parseAdFromJS(jsonAdDescription))
        }
      }

      // Side-loaded text tracks
      val textTracks = jsonSourceObject.optJSONArray(PROP_TEXT_TRACKS)
      val sideLoadedTextTracks = ArrayList<TextTrackDescription>()
      if (textTracks != null) {
        for (i in 0 until textTracks.length()) {
          val jsonTextTrack = textTracks[i] as JSONObject
          sideLoadedTextTracks.add(parseTextTrackFromJS(jsonTextTrack))
        }
      }
      val builder = SourceDescription.Builder(*typedSources.toTypedArray())
        .poster(poster)
        .ads(*ads.toTypedArray())
        .textTracks(*sideLoadedTextTracks.toTypedArray())
      if (metadataDescription != null) {
        builder.metadata(metadataDescription)
      }
      return builder.build()
    } catch (e: JSONException) {
      e.printStackTrace()
    }
    return null
  }

  private fun parseTheoLiveSource(jsonTypedSource: JSONObject): TheoLiveSource {
    return TheoLiveSource(
      src=jsonTypedSource.optString(PROP_SRC),
      headers=jsonTypedSource.optJSONObject(PROP_HEADERS)?.let {
        BridgeUtils.fromJSONObjectToMap(it)
      },
      latencyConfiguration=jsonTypedSource.optJSONObject(PROP_LATENCY_CONFIGURATION)?.let {
        parseLatencyConfiguration(it)
      }
    )
  }

  @Throws(THEOplayerException::class)
  private fun parseTypedSource(jsonTypedSource: JSONObject, cmcdTransmissionMode: CMCDTransmissionMode? = null): TypedSource {
    // Some integrations do not support the Builder pattern
    return when {
      (jsonTypedSource.optString(PROP_INTEGRATION)) == INTEGRATION_THEOLIVE -> parseTheoLiveSource(jsonTypedSource)
      (jsonTypedSource.optString(PROP_TYPE)) == TYPE_MILLICAST -> parseMillicastSource(jsonTypedSource)
      else -> parseTypedSourceFromBuilder(jsonTypedSource, cmcdTransmissionMode)
    }
  }

  @Throws(THEOplayerException::class)
  private fun parseTypedSourceFromBuilder(jsonTypedSource: JSONObject, cmcdTransmissionMode: CMCDTransmissionMode? = null): TypedSource {
    try {
      var tsBuilder = TypedSource.Builder(jsonTypedSource.optString(PROP_SRC))
      val sourceType = parseSourceType(jsonTypedSource)
      jsonTypedSource.optJSONObject(PROP_SSAI)?.let { ssaiJson ->
        tsBuilder = SSAIAdapterRegistry.typedSourceBuilderFromJson(ssaiJson, tsBuilder, sourceType)
      }
      if (sourceType != null) {
        tsBuilder.type(sourceType)
      }
      jsonTypedSource.optJSONObject(PROP_DASH)?.let { dashJson ->
        tsBuilder.dash(parseDashConfig(dashJson))
      }
      jsonTypedSource.optJSONObject(PROP_HEADERS)?.let { headersJson ->
        tsBuilder.headers(BridgeUtils.fromJSONObjectToMap(headersJson))
      }
      if (jsonTypedSource.has(PROP_LIVE_OFFSET)) {
        tsBuilder.liveOffset(jsonTypedSource.getDouble(PROP_LIVE_OFFSET))
      }
      if (jsonTypedSource.has(PROP_HLS_DATERANGE)) {
        tsBuilder.hlsDateRange(jsonTypedSource.getBoolean(PROP_HLS_DATERANGE))
      }
      if (jsonTypedSource.has(PROP_HLS_PLAYBACK_CONFIG)) {
        val hlsConfig = gson.fromJson(
          jsonTypedSource[PROP_HLS_PLAYBACK_CONFIG].toString(),
          HlsPlaybackConfiguration::class.java
        )
        tsBuilder.hls(hlsConfig)
      }
      if (jsonTypedSource.has(PROP_TIME_SERVER)) {
        tsBuilder.timeServer(jsonTypedSource.getString(PROP_TIME_SERVER))
      }
      if (jsonTypedSource.has(PROP_CONTENT_PROTECTION)) {
        val drmConfig = ContentProtectionAdapter.drmConfigurationFromJson(
          jsonTypedSource.getJSONObject(PROP_CONTENT_PROTECTION)
        )
        if (drmConfig != null) {
          tsBuilder.drm(drmConfig)
        }
      }
      if (jsonTypedSource.has(PROP_PLAYBACK_PIPELINE)) {
        tsBuilder.playbackPipeline(when(jsonTypedSource.getString(PROP_PLAYBACK_PIPELINE)) {
          PLAYBACK_PIPELINE_LEGACY -> PlaybackPipeline.LEGACY
          else -> PlaybackPipeline.MEDIA3
        })
      }
      if (cmcdTransmissionMode != null) {
        tsBuilder.cmcdTransmissionMode(cmcdTransmissionMode)
      }
      return tsBuilder.build()
    } catch (e: THEOplayerException) {
      // Rethrow THEOplayerException
      throw e
    } catch (e: Exception) {
      // Wrap exception
      throw THEOplayerException(ErrorCode.SOURCE_INVALID, "Invalid source: ${e.message}")
    }
  }

  @Throws(THEOplayerException::class)
  fun parseAdFromJS(map: ReadableMap): AdDescription? {
    return try {
      val jsonAdDescription = JSONObject(gson.toJson(map.toHashMap()))
      parseAdFromJS(jsonAdDescription)
    } catch (e: JSONException) {
      e.printStackTrace()
      null
    }
  }

  private fun parseSourceType(jsonTypedSource: JSONObject): SourceType? {
    val type = jsonTypedSource.optString(PROP_TYPE)
    if (type.isNotEmpty()) {
      if ("application/dash+xml" == type) {
        return SourceType.DASH
      }
      if ("application/x-mpegurl" == type) {
        return SourceType.HLSX
      }
      if ("application/vnd.theo.hesp+json" == type) {
        return SourceType.HESP
      }
      if ("application/vnd.apple.mpegurl" == type) {
        return SourceType.HLS
      }
      if ("video/mp4" == type) {
        return SourceType.MP4
      }
      if ("audio/mpeg" == type) {
        return SourceType.MP3
      }
    } else {
      // No type given, check for known extension.
      val src = jsonTypedSource.optString(PROP_SRC)
      if (src.endsWith(".mpd")) {
        return SourceType.DASH
      }
      if (src.endsWith(".m3u8")) {
        return SourceType.HLSX
      }
      if (src.endsWith(".mp4")) {
        return SourceType.MP4
      }
      if (src.endsWith(".mp3")) {
        return SourceType.MP3
      }
    }
    return null
  }

  @Throws(JSONException::class, THEOplayerException::class)
  fun parseAdFromJS(jsonAdDescription: JSONObject): AdDescription {
    val integrationStr = jsonAdDescription.optString(PROP_INTEGRATION)
    return if (!TextUtils.isEmpty(integrationStr)) {
      when (integrationStr) {
        AdIntegration.GOOGLE_IMA.adIntegration -> parseImaAdFromJS(
          jsonAdDescription
        )
        AdIntegration.THEO_ADS.adIntegration -> parseTheoAdFromJS(
          jsonAdDescription
        )
        else -> {
          throw THEOplayerException(
            ErrorCode.AD_ERROR,
            "$ERROR_UNSUPPORTED_CSAI_INTEGRATION: $integrationStr"
          )
        }
      }
    } else {
      throw THEOplayerException(
        ErrorCode.AD_ERROR,
        "$ERROR_MISSING_CSAI_INTEGRATION: $integrationStr"
      )
    }
  }

  @Throws(THEOplayerException::class)
  private fun parseImaAdFromJS(jsonAdDescription: JSONObject): GoogleImaAdDescription {
    if (!BuildConfig.EXTENSION_GOOGLE_IMA) {
      throw THEOplayerException(ErrorCode.AD_ERROR, ERROR_IMA_NOT_ENABLED)
    }
    val source: String
    // Property `sources` is of type string | AdSource.
    val sourceObj = jsonAdDescription.optJSONObject(PROP_SOURCES)
    source = if (sourceObj != null) {
      sourceObj.optString(PROP_SRC)
    } else {
      jsonAdDescription.optString(PROP_SOURCES)
    }
    return GoogleImaAdDescription.Builder(source)
      .timeOffset(jsonAdDescription.optString(PROP_TIME_OFFSET))
      .build()
  }

  @Throws(JSONException::class)
  private fun parseTheoAdFromJS(jsonAdDescription: JSONObject): TheoAdDescription {
    if (!BuildConfig.EXTENSION_THEOADS) {
      throw THEOplayerException(ErrorCode.AD_ERROR, ERROR_THEOADS_NOT_ENABLED)
    }
    return TheoAdDescription(
      adTagParameters = parseAdTagParameters(jsonAdDescription.optJSONObject(PROP_AD_TAG_PARAMETERS)),
      backdropDoubleBox = jsonAdDescription.optString(PROP_BACKDROP_DOUBLE_BOX).takeIf { it.isNotEmpty() },
      backdropLShape = jsonAdDescription.optString(PROP_BACKDROP_LSHAPE).takeIf { it.isNotEmpty() },
      customAssetKey = jsonAdDescription.optString(PROP_CUSTOM_ASSET_KEY).takeIf { it.isNotEmpty() },
      networkCode = jsonAdDescription.optString(PROP_NETWORK_CODE).takeIf { it.isNotEmpty() },
      overrideLayout = parseOverrideLayout(jsonAdDescription.optString(PROP_OVERRIDE_LAYOUT)),
      useId3 = jsonAdDescription.optBoolean(PROP_USE_ID3, false),
      retrievePodIdURI = jsonAdDescription.optString(PROP_RETRIEVE_POD_ID_URI).takeIf { it.isNotEmpty() },
      sseEndpoint = jsonAdDescription.optString(PROP_SSE_ENDPOINT).takeIf { it.isNotEmpty() },
    )
  }

  private fun parseAdTagParameters(params: JSONObject?): Map<String, String> =
    params?.keys()?.asSequence()
      ?.mapNotNull { key -> key to params.optString(key) }
      ?.toMap() ?: emptyMap()

  private fun parseOverrideLayout(override: String?): TheoAdsLayoutOverride? {
    if (override == null) {
      return null
    }
    when (override) {
      "single" -> return TheoAdsLayoutOverride.SINGLE
      "single-if-mobile" -> return TheoAdsLayoutOverride.SINGLE
      "l-shape" -> return TheoAdsLayoutOverride.LSHAPE
      "double" -> return TheoAdsLayoutOverride.DOUBLE
    }
    return null
  }

  @Throws(JSONException::class)
  private fun parseTextTrackFromJS(jsonTextTrack: JSONObject): TextTrackDescription {
    val builder = TextTrackDescription.Builder(jsonTextTrack.optString(PROP_SRC))
      .isDefault(jsonTextTrack.optBoolean(PROP_DEFAULT))
      .label(jsonTextTrack.optString(PROP_LABEL))
      .srclang(jsonTextTrack.optString(PROP_SRCLANG))
      .kind(parseTextTrackKind(jsonTextTrack.optString(PROP_KIND))!!)
    return builder.build()
  }

  private fun parseTextTrackKind(kind: String?): TextTrackKind? {
    if (kind == null) {
      return null
    }
    when (kind) {
      "subtitles" -> return TextTrackKind.SUBTITLES
      "metadata" -> return TextTrackKind.METADATA
      "captions" -> return TextTrackKind.CAPTIONS
      "chapters" -> return TextTrackKind.CHAPTERS
      "descriptions" -> return TextTrackKind.DESCRIPTIONS
    }
    return null
  }

  private fun parseMetadataDescription(metadataDescription: JSONObject): MetadataDescription {
    val metadata = HashMap<String, Any?>()
    val keys = metadataDescription.keys()
    while (keys.hasNext()) {
      val key = keys.next()
      try {
        if (key == "images") {
          metadata[key] = parseMetadataImages(metadataDescription.getJSONArray(key))
        } else {
          metadata[key] = metadataDescription[key]
        }
      } catch (e: JSONException) {
        Log.w(TAG, "Failed to parse metadata key $key")
      }
    }
    return MetadataDescription(metadata as MutableMap<String, Any?>)
  }

  private fun parseDashConfig(dashConfig: JSONObject): DashPlaybackConfiguration {
    return DashPlaybackConfiguration.Builder()
      .ignoreAvailabilityWindow(dashConfig.optBoolean(PROP_DASH_IGNORE_AVAILABILITYWINDOW))
      .build()
  }

  @Throws(JSONException::class)
  private fun parseMetadataImages(metadataImages: JSONArray): List<ChromecastMetadataImage> {
    val imageList: MutableList<ChromecastMetadataImage> = ArrayList()
    for (i in 0 until metadataImages.length()) {
      imageList.add(parseMetadataImage(metadataImages.getJSONObject(i)))
    }
    return imageList
  }

  @Throws(JSONException::class)
  private fun parseMetadataImage(metadataImage: JSONObject): ChromecastMetadataImage {
    val width = if (metadataImage.has("width")) metadataImage.getInt("width") else null
    val height = if (metadataImage.has("height")) metadataImage.getInt("height") else null
    return ChromecastMetadataImage(metadataImage.optString("src"), width, height)
  }

  fun fromSourceDescription(source: SourceDescription): WritableMap {
    val json = JSONObject(gson.toJson(source))

    // Normalize metadata
    // The player SDK adds an extra 'data' level within metadata: flatten.
    json.optJSONObject(PROP_METADATA)?.optJSONObject(PROP_DATA)?.let { newMetadata ->
      json.put(PROP_METADATA, newMetadata)
    }

    return BridgeUtils.fromJSONObjectToBridge(json)
  }

  private fun parseCmcdTransmissionMode(cmcdConfiguration : JSONObject) : CMCDTransmissionMode {
    try {
      val transmissionMode = cmcdConfiguration.optInt(CMCD_TRANSMISSION_MODE)
      if (transmissionMode === CmcdTransmissionMode.QUERY_ARGUMENT.ordinal) {
        return CMCDTransmissionMode.QUERY_ARGUMENT
      }
      return CMCDTransmissionMode.HTTP_HEADER
    } catch (e: JSONException) {
      e.printStackTrace()
      return CMCDTransmissionMode.HTTP_HEADER
    }
  }
}
