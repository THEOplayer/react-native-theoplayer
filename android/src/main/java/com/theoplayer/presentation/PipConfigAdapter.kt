package com.theoplayer.presentation

import com.facebook.react.bridge.ReadableMap

object PipConfigAdapter {

  private const val PROP_AUTO = "startsAutomatically"

  fun fromProps(configProps: ReadableMap?): PipConfig {
    return PipConfig(
      if (configProps?.hasKey(PROP_AUTO) == true) configProps.getBoolean(PROP_AUTO) else false
    )
  }
}
