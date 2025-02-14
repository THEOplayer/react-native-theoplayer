package com.theoplayer.latency

import com.theoplayer.android.api.latency.LatencyConfiguration
import org.json.JSONObject

private const val PROP_MINIMUM_OFFSET = "minimumOffset"
private const val PROP_MAXIMUM_OFFSET = "maximumOffset"
private const val PROP_TARGET_OFFSET = "targetOffset"
private const val PROP_FORCE_SEEK_OFFSET = "forceSeekOffset"
private const val PROP_MINIMUM_PLAYBACK_RATE = "minimumPlaybackRate"
private const val PROP_MAXIMUM_PLAYBACK_RATE = "maximumPlaybackRate"

fun parseLatencyConfiguration(jsonLatency: JSONObject): LatencyConfiguration {
  return LatencyConfiguration.Builder().apply {
    setMinimumOffset(jsonLatency.optDouble(PROP_MINIMUM_OFFSET))
    setMaximumOffset(jsonLatency.optDouble(PROP_MAXIMUM_OFFSET))
    setTargetOffset(jsonLatency.optDouble(PROP_TARGET_OFFSET))
    setForceSeekOffset(jsonLatency.optDouble(PROP_FORCE_SEEK_OFFSET))
    setMinimumPlaybackRate(jsonLatency.optDouble(PROP_MINIMUM_PLAYBACK_RATE))
    setMaximumPlaybackRate(jsonLatency.optDouble(PROP_MAXIMUM_PLAYBACK_RATE))
  }.build()
}
