@file:Suppress("unused")

package com.theoplayer.cast

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.theoplayer.specs.CastModuleSpec
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.cast.chromecast.PlayerCastState
import com.theoplayer.util.ViewResolver

@ReactModule(name = CastModule.NAME)
class CastModule(context: ReactApplicationContext) : CastModuleSpec(context) {
  private val viewResolver: ViewResolver = ViewResolver(context)

  companion object {
    const val NAME = "THEORCTCastModule"
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun casting(tag: Double, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      promise.resolve(view?.playerContext?.castIntegration?.isCasting() ?: false)
    }
  }

  @ReactMethod
  override fun chromecastCasting(tag: Double, promise: Promise) {
    casting(tag, promise)
  }

  override fun airplayCasting(tag: Double, promise: Promise) {
    promise.resolve(false)
  }

  @ReactMethod
  override fun chromecastState(tag: Double, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      promise.resolve(
        castStateToString(
          view?.playerContext?.castIntegration?.getState() ?: PlayerCastState.UNAVAILABLE
        )
      )
    }
  }

  override fun airplayState(tag: Double, promise: Promise) {
    promise.resolve(false)
  }

  private fun castStateToString(state: PlayerCastState): String {
    return when (state) {
      PlayerCastState.AVAILABLE -> "available"
      PlayerCastState.CONNECTED -> "connected"
      PlayerCastState.CONNECTING -> "connecting"
      PlayerCastState.UNAVAILABLE -> "unavailable"
      else -> "unavailable"
    }
  }

  @ReactMethod
  override fun chromecastStart(tag: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.castIntegration?.start()
    }
  }

  @ReactMethod
  override fun chromecastStop(tag: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.castIntegration?.stop()
    }
  }

  @ReactMethod
  override fun chromecastJoin(tag: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.castIntegration?.join()
    }
  }

  @ReactMethod
  override fun chromecastLeave(tag: Double) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.castIntegration?.leave()
    }
  }

  override fun airplayStart(tag: Double) {
    // ignore
  }

  override fun airplayStop(tag: Double) {
    // ignore
  }
}
