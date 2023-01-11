@file:Suppress("unused")

package com.theoplayer.ads

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ads.AdAdapter.fromAdBreak
import com.theoplayer.ads.AdAdapter.fromAds
import com.theoplayer.ads.AdAdapter.fromAdBreaks
import com.theoplayer.source.SourceAdapter
import com.theoplayer.util.ViewResolver
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.error.THEOplayerException

private const val TAG = "AdsModule"

class AdsModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val sourceHelper = SourceAdapter()
  private val viewResolver: ViewResolver

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  // Add an ad break request.
  @ReactMethod
  fun schedule(tag: Int, ad: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      if (view != null) {
        try {
          view.adsApi.schedule(sourceHelper.parseAdFromJS(ad))
        } catch (exception: THEOplayerException) {
          Log.e(TAG, exception.message!!)
        }
      }
    }
  }

  // The currently playing ad break.
  @ReactMethod
  fun currentAdBreak(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      if (view == null) {
        promise.resolve(Arguments.createMap())
      } else {
        promise.resolve(fromAdBreak(view.adsApi.currentAdBreak))
      }
    }
  }

  // List of currently playing ads.
  @ReactMethod
  fun currentAds(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      if (view == null) {
        promise.resolve(Arguments.createMap())
      } else {
        promise.resolve(fromAds(view.adsApi.currentAds))
      }
    }
  }

  // List of ad breaks which still need to be played.
  @ReactMethod
  fun scheduledAdBreaks(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      if (view == null) {
        promise.resolve(Arguments.createMap())
      } else {
        promise.resolve(fromAdBreaks(view.adsApi.scheduledAdBreaks))
      }
    }
  }

  // Whether a linear ad is currently playing.
  @ReactMethod
  fun playing(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      if (view == null) {
        promise.resolve(false)
      } else {
        promise.resolve(view.adsApi.isPlaying)
      }
    }
  }

  // Skip the current linear ad.
  // NOTE: This will have no effect when the current linear ad is (not yet) skippable.
  @ReactMethod
  fun skip(tag: Int) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? -> view?.adsApi?.skip() }
  }

  @ReactMethod
  fun daiSnapback(tag: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      val daiIntegration = view?.daiIntegration
      if (daiIntegration == null) {
        promise.resolve(false)
      } else {
        promise.resolve(daiIntegration.enableSnapback)
      }
    }
  }

  @ReactMethod
  fun daiSetSnapback(tag: Int, enabled: Boolean?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      val daiIntegration = view?.daiIntegration
      if (daiIntegration != null) {
        daiIntegration.enableSnapback = enabled!!
      }
    }
  }

  @ReactMethod
  fun daiContentTimeForStreamTime(tag: Int, time: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      val daiIntegration = view?.daiIntegration
      if (daiIntegration == null) {
        promise.resolve(time)
      } else {
        promise.resolve((1e03 * daiIntegration.contentTimeForStreamTime(1e-03 * time)).toInt())
      }
    }
  }

  @ReactMethod
  fun daiStreamTimeForContentTime(tag: Int, time: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      val daiIntegration = view?.daiIntegration
      if (daiIntegration == null) {
        promise.resolve(time)
      } else {
        promise.resolve((1e03 * daiIntegration.streamTimeForContentTime(1e-03 * time)).toInt())
      }
    }
  }
}
