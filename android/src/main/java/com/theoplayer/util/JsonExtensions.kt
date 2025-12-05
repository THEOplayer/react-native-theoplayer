package com.theoplayer.util

import org.json.JSONObject

/**
 * Returns the double value mapped by [name], or `null` if no such mapping exists.
 */
fun JSONObject.optDoubleOrNull(name: String): Double? {
  return if (has(name)) getDouble(name) else null
}
