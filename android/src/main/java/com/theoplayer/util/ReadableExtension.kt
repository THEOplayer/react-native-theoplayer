package com.theoplayer.util

import com.facebook.react.bridge.ReadableMap

/**
 * Gets a boolean value from the map, or null if the key does not exist.
 */
fun ReadableMap.getBooleanOrNull(name: String): Boolean? {
  return if (hasKey(name)) getBoolean(name) else null
}

/**
 * Gets a boolean value from the map, or [default] if the map or the key does not exist.
 */
fun ReadableMap?.getBooleanOr(name: String, default: Boolean): Boolean {
  return if (this?.hasKey(name) == true) getBoolean(name) else default
}

/**
 * Gets a double value from the map, or [default] if the map or the key does not exist.
 */
fun ReadableMap?.getDoubleOr(name: String, default: Double): Double {
  return if (this?.hasKey(name) == true) getDouble(name) else default
}
