package com.theoplayer.theoads

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.model.ReactModuleInfo
import com.theoplayer.*
import com.theoplayer.android.api.ads.theoads.theoAds
import com.theoplayer.theoads.THEOadsAdapter.fromInterstitialList
import com.theoplayer.util.ViewResolver

@Suppress("unused")
@ReactModule(name = THEOadsModule.NAME)
class THEOadsModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  companion object {
    const val NAME = "THEORCTTHEOAdsModule"
    val INFO = ReactModuleInfo(
      name = NAME,
      className = NAME,
      canOverrideExistingModule = false,
      needsEagerInit = false,
      isCxxModule = false,
      isTurboModule = false,
    )
  }

  private val viewResolver: ViewResolver = ViewResolver(context)

  override fun getName(): String {
    return NAME
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
