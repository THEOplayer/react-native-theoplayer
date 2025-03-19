package com.theoplayer.source

import com.millicast.subscribers.ForcePlayoutDelay
import com.millicast.subscribers.Option
import com.theoplayer.android.api.millicast.MillicastSource
import org.json.JSONObject

private const val PROP_SRC = "src"
private const val PROP_STREAM_ACCOUNT_ID = "streamAccountId"
private const val PROP_API_URL = "apiUrl"
private const val PROP_SUBSCRIBER_TOKEN = "subscriberToken"
private const val PROP_CONNECT_OPTIONS = "connectOptions"

private const val BWE_MONITOR_DURATION_US = "bweMonitorDurationUs"
private const val BWE_RATE_CHANGE_PERCENTAGE = "bweRateChangePercentage"
private const val DISABLE_AUDIO = "disableAudio"
private const val DTX = "dtx"
private const val EXCLUDED_SOURCE_ID = "excludedSourceId"
private const val FORCE_PLAYOUT_DELAY = "forcePlayoutDelay"
private const val MINIMUM_DELAY = "minimumDelay"
private const val MAXIMUM_DELAY = "maximumDelay"
private const val FORCE_SMOOTH = "forceSmooth"
private const val JITTER_MINIMUM_DELAY_MS = "jitterMinimumDelayMs"
private const val MAXIMUM_BITRATE = "maximumBitrate"
private const val MULTIPLEXED_AUDIO_TRACK = "multiplexedAudioTrack"
private const val PINNED_SOURCE_ID = "pinnedSourceId"
private const val RTC_EVENT_LOG_OUTPUT_PATH = "rtcEventLogOutputPath"
private const val STATS_DELAY_MS = "statsDelayMs"
private const val STEREO = "stereo"
private const val UPWARDS_LAYER_WAIT_TIME_MS = "upwardsLayerWaitTimeMs"

fun parseMillicastSource(jsonTypedSource: JSONObject): MillicastSource {
  return MillicastSource(
    src = jsonTypedSource.optString(PROP_SRC),
    streamAccountId = jsonTypedSource.optString(PROP_STREAM_ACCOUNT_ID),
    apiUrl = jsonTypedSource.optString(PROP_API_URL),
    subscriberToken = when (val token = jsonTypedSource.optString(PROP_SUBSCRIBER_TOKEN)) {
      "" -> null
      else -> token
    },
    connectOptions = jsonTypedSource.optJSONObject(PROP_CONNECT_OPTIONS)
      ?.let { buildMillicastConnectOptions(it) }
  )
}

fun buildMillicastConnectOptions(jsonObject: JSONObject): Option {
  return Option(
    bweMonitorDurationUs = when (val bweMonitorDurationUs = jsonObject.optInt(BWE_MONITOR_DURATION_US, -1)) {
      -1 -> null
      else -> bweMonitorDurationUs
    },
    bweRateChangePercentage = when (val bweRateChangePercentage = jsonObject.optDouble(BWE_RATE_CHANGE_PERCENTAGE, -1.0)) {
      -1.0 -> null
      else -> bweRateChangePercentage
    },
    disableAudio = jsonObject.optBoolean(DISABLE_AUDIO),
    dtx = jsonObject.optBoolean(DTX),
    excludedSourceId = when (val excludedSourceId = jsonObject.optJSONArray(EXCLUDED_SOURCE_ID)) {
      null -> arrayOf()
      else -> Array(excludedSourceId.length()) {
        excludedSourceId.getString(it)
      }
    },
    forcePlayoutDelay = jsonObject.optJSONObject(FORCE_PLAYOUT_DELAY)?.let {
      ForcePlayoutDelay(
        minimumDelay = it.getInt(MINIMUM_DELAY),
        maximumDelay = it.getInt(MAXIMUM_DELAY)
      )
    },
    forceSmooth = jsonObject.optBoolean(FORCE_SMOOTH),
    jitterMinimumDelayMs = jsonObject.optInt(JITTER_MINIMUM_DELAY_MS),
    maximumBitrate = when (val maximumBitrate = jsonObject.optInt(MAXIMUM_BITRATE, -1)) {
      -1 -> null
      else -> maximumBitrate
    },
    multiplexedAudioTrack = when (val multiplexedAudioTrack = jsonObject.optString(MULTIPLEXED_AUDIO_TRACK)) {
      "" -> UByte.MIN_VALUE
      else -> multiplexedAudioTrack.toUByte()
    },
    pinnedSourceId = when (val pinnedSourceId = jsonObject.optString(PINNED_SOURCE_ID)) {
      "" -> null
      else -> pinnedSourceId
    },
    rtcEventLogOutputPath = jsonObject.optString(RTC_EVENT_LOG_OUTPUT_PATH),
    statsDelayMs = when (val statsDelayMs = jsonObject.optInt(STATS_DELAY_MS, -1)) {
      -1 -> 1000
      else -> statsDelayMs
    },
    stereo = jsonObject.optBoolean(STEREO, true),
    upwardsLayerWaitTimeMs = when (val upwardsLayerWaitTimeMs = jsonObject.optInt(UPWARDS_LAYER_WAIT_TIME_MS, -1)) {
      -1 -> null
      else -> upwardsLayerWaitTimeMs
    }
  )
}
