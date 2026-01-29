package com.theoplayer.util

import com.facebook.react.bridge.ReadableMap

/**
 * Gets a boolean value from the map, or null if the key does not exist.
 */
fun ReadableMap.getBooleanOrNull(name: String): Boolean? {
  return if (hasKey(name)) getBoolean(name) else null
}
