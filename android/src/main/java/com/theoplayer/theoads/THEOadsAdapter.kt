package com.theoplayer.theoads

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.ads.theoads.Interstitial
import com.theoplayer.android.api.ads.theoads.InterstitialType

private const val PROP_ID = "id"
private const val PROP_TYPE = "TYPE"
private const val PROP_START_TIME = "startTime"
private const val PROP_DURATION = "duration"

object THEOadsAdapter {

  fun fromInterstitialList(interstitial: List<Interstitial>?): WritableArray {
    return Arguments.createArray().apply { interstitial?.forEach { pushMap(fromInterstitial(it)) } }
  }

  fun fromInterstitial(interstitial: Interstitial): WritableMap {
    return Arguments.createMap().apply {
      putString(PROP_ID, interstitial.id)
      putString(PROP_TYPE, when (interstitial.type) {
        InterstitialType.ADBREAK -> "adbreak"
        InterstitialType.OVERLAY -> "overlay"
      })
      putDouble(PROP_START_TIME, interstitial.startTime)
      interstitial.duration?.let { it -> putDouble(PROP_DURATION, it) }
    }
  }
}
