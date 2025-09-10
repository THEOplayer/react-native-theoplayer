package com.theoplayer.theoads

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.theoplayer.ads.AdAdapter.fromAds
import com.theoplayer.android.api.ads.theoads.AdBreakInterstitial
import com.theoplayer.android.api.ads.theoads.Interstitial
import com.theoplayer.android.api.ads.theoads.InterstitialType
import com.theoplayer.android.api.ads.theoads.OverlayInterstitial
import com.theoplayer.android.api.ads.theoads.OverlayPosition
import com.theoplayer.android.api.ads.theoads.OverlaySize
import com.theoplayer.android.api.ads.theoads.TheoAdsLayout

private const val PROP_ID = "id"
private const val PROP_TYPE = "TYPE"
private const val PROP_START_TIME = "startTime"
private const val PROP_DURATION = "duration"
private const val PROP_BACKDROP_URI = "backdropUri"
private const val PROP_LAYOUT = "layout"
private const val PROP_ADS = "ads"
private const val PROP_IMAGE_URL = "imageUrl"
private const val PROP_CLICK_THROUGH = "clickThrough"
private const val PROP_POSITION = "position"
private const val PROP_SIZE = "size"
private const val PROP_TOP = "top"
private const val PROP_LEFT = "left"
private const val PROP_RIGHT = "right"
private const val PROP_BOTTOM = "bottom"
private const val PROP_WIDTH = "width"
private const val PROP_HEIGHT = "height"

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

      (interstitial as? AdBreakInterstitial)?.let {
        interstitial.backdropUri?.let { it -> putString(PROP_BACKDROP_URI, it) }
        putString(PROP_LAYOUT, when (interstitial.layout) {
          TheoAdsLayout.SINGLE -> "single"
          TheoAdsLayout.L_SHAPE -> "l-shape"
          else /*TheoAdsLayout.DOUBLE*/ -> "double"
        })
        putArray(PROP_ADS, fromAds(interstitial.ads))
      }

      (interstitial as? OverlayInterstitial)?.let {
        interstitial.imageUrl?.let { it -> putString(PROP_IMAGE_URL, it) }
        interstitial.clickThrough?.let { it -> putString(PROP_CLICK_THROUGH, it) }
        putMap(PROP_POSITION, fromOverlayPosition(interstitial.position))
        putMap(PROP_SIZE, fromOverlaySize(interstitial.size))
      }
    }
  }

  fun fromOverlayPosition(position: OverlayPosition): WritableMap {
    return Arguments.createMap().apply {
      putDouble(PROP_TOP, position.top)
      putDouble(PROP_RIGHT, position.right)
      putDouble(PROP_LEFT, position.left)
      putDouble(PROP_BOTTOM, position.bottom)
    }
  }

  fun fromOverlaySize(size: OverlaySize): WritableMap {
    return Arguments.createMap().apply {
      putDouble(PROP_WIDTH, size.width)
      putDouble(PROP_HEIGHT, size.height)
    }
  }
}
