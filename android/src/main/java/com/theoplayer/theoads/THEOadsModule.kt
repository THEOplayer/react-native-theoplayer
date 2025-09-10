package com.theoplayer.theoads

import com.facebook.react.bridge.*
import com.theoplayer.*
import com.theoplayer.android.api.ads.theoads.theoAds
import com.theoplayer.theoads.THEOadsAdapter.fromInterstitialList
import com.theoplayer.util.ViewResolver

private const val TAG = "THEORCTTHEOAdsModule"

@Suppress("unused")
class THEOadsModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val viewResolver: ViewResolver = ViewResolver(context)

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun currentInterstitials(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      promise.resolve(fromInterstitialList(view?.player?.theoAds?.currentInterstitials))
    }
  }

  @ReactMethod
  fun scheduledInterstitials(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      promise.resolve(fromInterstitialList(view?.player?.theoAds?.scheduledInterstitials))
    }
  }

  @ReactMethod
  fun replaceAdTagParameters(tag: Int, adTagParameters: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.theoAds?.replaceAdTagParameters(adTagParameters.toHashMap().mapValues { it.value.toString() })
    }
  }
}
