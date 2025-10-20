package com.theoplayer.theolive

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.model.ReactModuleInfo
import com.theoplayer.*
import com.theoplayer.util.ViewResolver

private const val PROP_ENGINE_LATENCY = "engineLatency"
private const val PROP_DISTRIBUTION_LATENCY = "distributionLatency"
private const val PROP_PLAYER_LATENCY = "playerLatency"
private const val PROP_THEOLIVE_LATENCY = "theoliveLatency"

@Suppress("unused")
@ReactModule(name = THEOliveModule.NAME)
class THEOliveModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  companion object {
    const val NAME = "THEORCTTHEOliveModule"
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
  fun currentLatency(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      // NYI on Android SDK
      promise.resolve(-1.0)
    }
  }

  @ReactMethod
  fun latencies(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      // NYI on Android SDK
      promise.resolve(Arguments.createMap().apply {
        putDouble(PROP_ENGINE_LATENCY, -1.0)
        putDouble(PROP_DISTRIBUTION_LATENCY, -1.0)
        putDouble(PROP_PLAYER_LATENCY, -1.0)
        putDouble(PROP_THEOLIVE_LATENCY, -1.0)
      })
    }
  }

  @ReactMethod
  fun setAuthToken(tag: Int, token: String?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.theoLive?.authToken = token
    }
  }
}
