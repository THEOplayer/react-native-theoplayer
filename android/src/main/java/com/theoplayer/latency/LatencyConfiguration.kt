package com.theoplayer.latency

import com.theoplayer.android.api.latency.LatencyConfiguration
import com.theoplayer.util.optDoubleOrNull
import org.json.JSONObject

private const val PROP_MINIMUM_OFFSET = "minimumOffset"
private const val PROP_MAXIMUM_OFFSET = "maximumOffset"
private const val PROP_TARGET_OFFSET = "targetOffset"
private const val PROP_FORCE_SEEK_OFFSET = "forceSeekOffset"
private const val PROP_MINIMUM_PLAYBACK_RATE = "minimumPlaybackRate"
private const val PROP_MAXIMUM_PLAYBACK_RATE = "maximumPlaybackRate"

fun parseLatencyConfiguration(jsonLatency: JSONObject): LatencyConfiguration {
  return LatencyConfiguration.Builder().apply {
    jsonLatency.optDoubleOrNull(PROP_MINIMUM_OFFSET)?.let { setMinimumOffset(it) }
    jsonLatency.optDoubleOrNull(PROP_MAXIMUM_OFFSET)?.let { setMaximumOffset(it) }
    jsonLatency.optDoubleOrNull(PROP_TARGET_OFFSET)?.let { setTargetOffset(it) }
    jsonLatency.optDoubleOrNull(PROP_FORCE_SEEK_OFFSET)?.let { setForceSeekOffset(it) }
    jsonLatency.optDoubleOrNull(PROP_MINIMUM_PLAYBACK_RATE)?.let { setMinimumPlaybackRate(it) }
    jsonLatency.optDoubleOrNull(PROP_MAXIMUM_PLAYBACK_RATE)?.let { setMaximumPlaybackRate(it) }
  }.build()
}
