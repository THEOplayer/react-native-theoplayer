package com.theoplayer.metrics

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.model.ReactModuleInfo
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

@Suppress("unused")
@ReactModule(name = MetricsModule.NAME)
class MetricsModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  companion object {
    const val NAME = "THEORCTMetricsModule"
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

  // The bandwidth, in bits per second, that the player estimates is currently available.
  @ReactMethod
  fun currentBandwidthEstimate(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      promise.resolve(view?.player?.metrics?.currentBandwidthEstimate ?: 0.0)
    }
  }
}
