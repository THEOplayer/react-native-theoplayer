package com.theoplayer.abr

import android.util.Size
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
  private const val PROP_PREFERRED_MAXIMUM_RESOLUTION = "preferredMaximumResolution"
  private const val PROP_WIDTH = "width"
  private const val PROP_HEIGHT = "height"

  fun applyABRConfigurationFromProps(player: Player?, abrProps: ReadableMap?) {
    if (abrProps == null || player == null) {
      return
    }
    if (abrProps.hasKey(PROP_TARGET_BUFFER)) {
      player.abr.targetBuffer = abrProps.getInt(PROP_TARGET_BUFFER)
    }
    // (0,0) is the documented sentinel for "no cap" and maps to a null Size on the native SDK.
    val preferredMaximumResolutionProps = abrProps.getMap(PROP_PREFERRED_MAXIMUM_RESOLUTION)
    if (preferredMaximumResolutionProps != null) {
      player.abr.preferredMaximumResolution = preferredMaximumResolutionFromProps(preferredMaximumResolutionProps)
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

  private fun preferredMaximumResolutionFromProps(props: ReadableMap?): Size? {
    if (props == null || !props.hasKey(PROP_WIDTH) || !props.hasKey(PROP_HEIGHT)) {
      return null
    }
    val width = props.getDouble(PROP_WIDTH).toInt()
    val height = props.getDouble(PROP_HEIGHT).toInt()
    if (width <= 0 || height <= 0) {
      return null
    }
    return Size(width, height)
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
