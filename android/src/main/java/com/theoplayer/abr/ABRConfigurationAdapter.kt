package com.theoplayer.abr

import com.facebook.react.bridge.ReadableMap
import com.theoplayer.android.api.abr.AbrStrategyConfiguration
import com.theoplayer.android.api.abr.AbrStrategyMetadata
import com.theoplayer.android.api.abr.AbrStrategyType
import com.theoplayer.android.api.player.Player

object ABRConfigurationAdapter {
  private const val PROP_TARGET_BUFFER = "targetBuffer"
  private const val PROP_STRATEGY = "strategy"
  private const val PROP_METADATA = "metadata"
  private const val PROP_TYPE = "type"
  private const val PROP_BITRATE = "bitrate"

  fun applyABRConfigurationFromProps(player: Player?, abrProps: ReadableMap?) {
    if (abrProps == null || player == null) {
      return
    }
    if (abrProps.hasKey(PROP_TARGET_BUFFER)) {
      player.abr.targetBuffer = abrProps.getInt(PROP_TARGET_BUFFER)
    }
    // Strategy can be either a string or an object
    try {
      val abrStrategyPropsString = abrProps.getString(PROP_STRATEGY)
      if (abrStrategyPropsString != null) {
        AbrStrategyConfiguration.Builder().apply {
          abrStrategyTypeFromString(abrStrategyPropsString)?.let { type ->
            setType(type)
          }
          player.abr.abrStrategy = build()
        }
      }
    } catch (_: Exception) {
    }
    try {
      val abrStrategyPropsMap = abrProps.getMap(PROP_STRATEGY)
      if (abrStrategyPropsMap != null) {
        AbrStrategyConfiguration.Builder().apply {
          abrMetadataFromProps(abrStrategyPropsMap.getMap(PROP_METADATA))?.let { metadata ->
            setMetadata(metadata)
          }
          abrStrategyTypeFromString(abrStrategyPropsMap.getString(PROP_TYPE))?.let { type ->
            setType(type)
          }
          player.abr.abrStrategy = build()
        }
      }
    } catch (_: Exception) {
    }
  }

  private fun abrMetadataFromProps(props: ReadableMap?): AbrStrategyMetadata? {
    if (props == null) {
      return null
    }
    val builder = AbrStrategyMetadata.Builder()
    if (props.hasKey(PROP_BITRATE)) {
      builder.setBitrate(props.getInt(PROP_BITRATE))
    }
    return builder.build()
  }

  private fun abrStrategyTypeFromString(type: String?): AbrStrategyType? {
    return when (type) {
      "performance" -> AbrStrategyType.PERFORMANCE
      "quality" -> AbrStrategyType.QUALITY
      "bandwidth" -> AbrStrategyType.BANDWIDTH
      else -> return null
    }
  }
}
