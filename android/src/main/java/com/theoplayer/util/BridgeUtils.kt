package com.theoplayer.util

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

object BridgeUtils {
  /**
   * Convert a JSONObject to bridge data.
   */
  fun fromJSONObjectToBridge(json: JSONObject): WritableMap {
    return Arguments.createMap().apply {
      try {
        val iterator = json.keys()
        while (iterator.hasNext()) {
          val key = iterator.next()
          when (val value = json.opt(key)) {
//            null -> putNull(key)
            is Boolean -> putBoolean(key, value)
            is Int -> putInt(key, value)
            is Double -> putDouble(key, value)
            is String -> putString(key, value)
            is JSONObject -> putMap(key, fromJSONObjectToBridge(value))
            is JSONArray -> putArray(key, fromJSONArrayToBridge(value))
            // Add other cases if needed for custom data types
          }
        }
      } catch (e: JSONException) {
        e.printStackTrace()
      }
    }
  }

  /**
   * Convert a JSONArray to bridge data.
   */
  private fun fromJSONArrayToBridge(jsonArray: JSONArray): WritableArray {
    return Arguments.createArray().apply {
      try {
        for (i in 0 until jsonArray.length()) {
          when (val value = jsonArray.opt(i)) {
//        null -> writableArray.pushNull()
            is Boolean -> pushBoolean(value)
            is Int -> pushInt(value)
            is Double -> pushDouble(value)
            is String -> pushString(value)
            is JSONObject -> pushMap(fromJSONObjectToBridge(value))
            is JSONArray -> pushArray(fromJSONArrayToBridge(value))
            // Add other cases if needed for custom data types
          }
        }
      } catch (e: JSONException) {
        e.printStackTrace()
      }
    }
  }
}
