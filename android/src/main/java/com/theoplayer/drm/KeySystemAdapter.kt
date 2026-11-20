package com.theoplayer.drm

import com.theoplayer.android.api.contentprotection.KeySystemId
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.error.THEOplayerException

private const val ERROR_INVALID_KEYSYSTEM_ID = "Invalid KeySystemId"

object KeySystemAdapter {
  fun fromString(keySystemStr: String): KeySystemId? {
    return when (keySystemStr.lowercase()) {
      "widevine", "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed" -> KeySystemId.WIDEVINE
      "playready", "urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95" -> KeySystemId.PLAYREADY
      "fairplay", "urn:uuid:94ce86fb-07bb-4b43-adb8-93d2fa968ca2" -> KeySystemId.FAIRPLAY
      "clearkey", "urn:uuid:e2719d58-a985-b3c9-781a-b030af78d30e" -> KeySystemId.CLEAR_KEY
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
