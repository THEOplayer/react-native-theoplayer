package com.theoplayer.util

import org.json.JSONObject

fun JSONObject.doubleOrNull(name: String): Double? {
  return if (has(name)) getDouble(name) else null
}
