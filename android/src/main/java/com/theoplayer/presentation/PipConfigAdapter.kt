package com.theoplayer.presentation

import com.facebook.react.bridge.ReadableMap

object PipConfigAdapter {

  private const val PROP_AUTO = "startsAutomatically"
  private const val PROP_REPARENT = "reparentPip"

  fun fromProps(configProps: ReadableMap?): PipConfig {
    return PipConfig(
      reparentPip = if (configProps?.hasKey(PROP_REPARENT) == true)
        configProps.getBoolean(PROP_REPARENT)
      else false,
      startsAutomatically = if (configProps?.hasKey(PROP_AUTO) == true)
        configProps.getBoolean(PROP_AUTO)
      else false
    )
  }
}
