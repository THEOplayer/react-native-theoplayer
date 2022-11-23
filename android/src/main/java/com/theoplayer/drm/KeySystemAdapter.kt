package com.theoplayer.drm

import com.theoplayer.android.api.contentprotection.KeySystemId

object KeySystemAdapter {
  fun fromString(keySystemStr: String): KeySystemId? {
    return when (keySystemStr) {
      "widevine" -> KeySystemId.WIDEVINE
      "playready" -> KeySystemId.PLAYREADY
      "fairplay" -> KeySystemId.FAIRPLAY
      else -> null
    }
  }

  fun toString(keySystemId: KeySystemId): String {
    return when (keySystemId) {
      KeySystemId.WIDEVINE -> "widevine"
      KeySystemId.PLAYREADY -> "playready"
      KeySystemId.FAIRPLAY -> "fairplay"
    }
  }
}
