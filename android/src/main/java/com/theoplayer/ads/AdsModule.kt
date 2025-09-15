package com.theoplayer.ads

import android.util.Log
import android.view.View
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.model.ReactModuleInfo
import com.theoplayer.source.SourceAdapter
import com.theoplayer.util.ViewResolver
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.ads.OmidFriendlyObstruction
import com.theoplayer.android.api.ads.OmidFriendlyObstructionPurpose
import com.theoplayer.android.api.error.THEOplayerException

private const val PROP_OMID_VIEW = "view"
private const val PROP_OMID_PURPOSE = "purpose"
private const val PROP_OMID_REASON = "reason"

@Suppress("unused")
@ReactModule(name = AdsModule.NAME)
class AdsModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  companion object {
    const val NAME = "THEORCTAdsModule"
    val INFO = ReactModuleInfo(
      name = NAME,
      className = NAME,
      canOverrideExistingModule = false,
      needsEagerInit = false,
      isCxxModule = false,
      isTurboModule = false,
    )
  }

  private val sourceHelper = SourceAdapter()
  private val viewResolver: ViewResolver = ViewResolver(context)

  override fun getName(): String {
    return NAME
  }

  // Add an ad break request.
  @ReactMethod
  fun schedule(tag: Int, ad: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      if (view != null) {
        try {
          view.adsApi.schedule(sourceHelper.parseAdFromJS(ad))
        } catch (exception: THEOplayerException) {
          Log.e(NAME, exception.message!!)
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
        promise.resolve(AdAdapter.fromAdBreak(view.adsApi.currentAdBreak))
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
        promise.resolve(AdAdapter.fromAds(view.adsApi.currentAds))
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
        promise.resolve(AdAdapter.fromAdBreaks(view.adsApi.scheduledAdBreaks))
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
      val daiIntegration = view?.playerContext?.daiIntegration
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
      val daiIntegration = view?.playerContext?.daiIntegration
      if (daiIntegration != null) {
        daiIntegration.enableSnapback = enabled!!
      }
    }
  }

  @ReactMethod
  fun daiContentTimeForStreamTime(tag: Int, time: Int, promise: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      val daiIntegration = view?.playerContext?.daiIntegration
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
      val daiIntegration = view?.playerContext?.daiIntegration
      if (daiIntegration == null) {
        promise.resolve(time)
      } else {
        promise.resolve((1e03 * daiIntegration.streamTimeForContentTime(1e-03 * time)).toInt())
      }
    }
  }

  @ReactMethod
  fun addFriendlyObstruction(tag: Int, obstruction: ReadableMap) {
    val obsTag =
      if (obstruction.hasKey(PROP_OMID_VIEW)) obstruction.getInt(PROP_OMID_VIEW) else null
    val purpose = if (obstruction.hasKey(PROP_OMID_PURPOSE)) {
      when (obstruction.getString(PROP_OMID_PURPOSE)) {
        "videoControls" -> OmidFriendlyObstructionPurpose.VIDEO_CONTROLS
        "closeAd" -> OmidFriendlyObstructionPurpose.CLOSE_AD
        "notVisible" -> OmidFriendlyObstructionPurpose.NOT_VISIBLE
        else -> OmidFriendlyObstructionPurpose.OTHER
      }
    } else null
    val reason =
      if (obstruction.hasKey(PROP_OMID_REASON)) obstruction.getString(PROP_OMID_REASON) else null

    if (obsTag !== null) {
      viewResolver.resolveViewByTag(obsTag) { obsView: View? ->
        addFriendlyObstruction(tag, obsView, purpose, reason)
      }
    }
  }

  private fun addFriendlyObstruction(
    tag: Int,
    obsView: View?,
    purpose: OmidFriendlyObstructionPurpose?,
    reason: String?
  ) {
    if (obsView == null || purpose == null) {
      return
    }
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.ads?.omid?.addFriendlyObstruction(
        OmidFriendlyObstruction(obsView, purpose, reason)
      )
    }
  }

  @ReactMethod
  fun removeAllFriendlyObstructions(tag: Int) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.ads?.omid?.removeAllFriendlyObstructions()
    }
  }
}
