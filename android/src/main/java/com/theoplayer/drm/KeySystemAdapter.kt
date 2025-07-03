package com.theoplayer.drm

import com.theoplayer.android.api.contentprotection.KeySystemId
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.error.THEOplayerException

private const val ERROR_INVALID_KEYSYSTEM_ID = "Invalid KeySystemId"

object KeySystemAdapter {
  fun fromString(keySystemStr: String): KeySystemId? {
    return when (keySystemStr) {
      "widevine" -> KeySystemId.WIDEVINE
      "playready" -> KeySystemId.PLAYREADY
      "fairplay" -> KeySystemId.FAIRPLAY
      "clearkey" -> KeySystemId.CLEAR_KEY
      else -> null
    }
  }

  fun toString(keySystemId: KeySystemId): String {
    @Suppress("REDUNDANT_ELSE_IN_WHEN")
    return when (keySystemId) {
      KeySystemId.WIDEVINE -> "widevine"
      KeySystemId.PLAYREADY -> "playready"
      KeySystemId.FAIRPLAY -> "fairplay"
      KeySystemId.CLEAR_KEY -> "clearkey"
      else -> throw THEOplayerException(
        ErrorCode.CONTENT_PROTECTION_CONFIGURATION_INVALID,
        "$ERROR_INVALID_KEYSYSTEM_ID: ${keySystemId.name}"
      )
    }
  }
}
