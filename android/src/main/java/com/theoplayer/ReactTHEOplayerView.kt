package com.theoplayer

import android.annotation.SuppressLint
import android.content.*
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.FrameLayout
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ThemedReactContext
import com.google.ads.interactivemedia.v3.api.AdsRenderingSettings
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory
import com.theoplayer.android.api.THEOplayerConfig
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegration
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegrationFactory.createGoogleDaiIntegration
import com.theoplayer.android.api.ads.ima.GoogleImaIntegration
import com.theoplayer.android.api.ads.ima.GoogleImaIntegrationFactory.createGoogleImaIntegration
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper
import com.theoplayer.android.api.cast.Cast
import com.theoplayer.android.api.cast.CastIntegration
import com.theoplayer.android.api.cast.CastIntegrationFactory.createCastIntegration
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality
import com.theoplayer.android.api.player.track.texttrack.TextTrack
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
import com.theoplayer.presentation.PresentationManager
import com.theoplayer.source.SourceAdapter
import com.theoplayer.util.TypeUtils.encodeInfNan

private const val TAG = "ReactTHEOplayerView"

@SuppressLint("ViewConstructor")
class ReactTHEOplayerView(private val reactContext: ThemedReactContext) :
  FrameLayout(reactContext), LifecycleEventListener {

  private val eventEmitter: PlayerEventEmitter = PlayerEventEmitter(reactContext.reactApplicationContext, this)
  private var playerView: THEOplayerView? = null
  private val mainHandler = Handler(Looper.getMainLooper())

  var presentationManager: PresentationManager? = null
  var daiIntegration: GoogleDaiIntegration? = null
  var imaIntegration: GoogleImaIntegration? = null
  var castIntegration: CastIntegration? = null
  val adsApi: AdsApiWrapper
  var player: Player? = null

  init {
    reactContext.addLifecycleEventListener(this)
    adsApi = AdsApiWrapper()
  }

  fun initialize(configProps: ReadableMap?) {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "Initialize view")
    }
    val playerConfig = PlayerConfigAdapter.fromProps(configProps)
    playerView = object : THEOplayerView(reactContext.currentActivity!!, playerConfig) {
      private fun measureAndLayout() {
        measure(
          MeasureSpec.makeMeasureSpec(measuredWidth, MeasureSpec.EXACTLY),
          MeasureSpec.makeMeasureSpec(measuredHeight, MeasureSpec.EXACTLY)
        )
        layout(left, top, right, bottom)
      }

      override fun requestLayout() {
        super.requestLayout()

        // schedule a forced layout
        mainHandler.post { measureAndLayout() }
      }
    }.also {view ->
      val layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      view.layoutParams = layoutParams
      addIntegrations(view, playerConfig)
      addView(view, 0, layoutParams)
      presentationManager = PresentationManager(view, reactContext, eventEmitter)
    }
  }

  val castApi: Cast?
    get() = playerView?.cast

  val duration: Double
    get() = encodeInfNan(if (player != null) 1e03 * player!!.duration else Double.NaN)

  override fun setId(id: Int) {
    super.setId(id)
    eventEmitter.setViewId(id)
  }

  private fun addIntegrations(playerView: THEOplayerView, playerConfig: THEOplayerConfig) {
    try {
      if (BuildConfig.EXTENSION_GOOGLE_IMA) {
        imaIntegration = createGoogleImaIntegration(playerView).apply {
          setAdsRenderingSettings(createRenderSettings(playerConfig))
          playerView.player.addIntegration(this)
        }
      }
    } catch (ignore: Exception) {
    }
    try {
      if (BuildConfig.EXTENSION_GOOGLE_DAI) {
        daiIntegration = createGoogleDaiIntegration(playerView).apply {
          setAdsRenderingSettings(createRenderSettings(playerConfig))
          playerView.player.addIntegration(this)
        }
      }
    } catch (ignore: Exception) {
    }
    try {
      if (BuildConfig.EXTENSION_CAST) {
        castIntegration = createCastIntegration(playerView).apply {
          playerView.player.addIntegration(this)
        }
      }
      // Add other future integrations here.
    } catch (ignore: Exception) {
    }
  }

  private fun createRenderSettings(playerConfig: THEOplayerConfig): AdsRenderingSettings {
    val renderingSettings = ImaSdkFactory.getInstance().createAdsRenderingSettings()
    if (playerConfig.ads != null && !playerConfig.ads!!.isShowCountdown) {
      renderingSettings.setUiElements(emptySet())
      renderingSettings.disableUi = true
    }
    return renderingSettings
  }

  override fun onAttachedToWindow() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onAttachedToWindow")
    }
    super.onAttachedToWindow()
    initializePlayer()
  }

  override fun onDetachedFromWindow() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onDetachedFromWindow")
    }
    super.onDetachedFromWindow()
  }

  private fun initializePlayer() {
    // This ensures all props have been passed
    mainHandler.postDelayed({
      if (player == null) {
        player = playerView?.player?.also {
          if (BuildConfig.EXTENSION_ADS) {
            adsApi.initialize(it, imaIntegration, daiIntegration)
          }
          eventEmitter.preparePlayer(it)
        }
      }
    }, 1)
  }

  override fun onHostPause() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostPause")
    }
    if (presentationManager?.shouldPauseOnHostPause != false) {
      playerView?.onPause()
    }
  }

  override fun onHostResume() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostResume")
    }
    playerView?.onResume()
  }

  override fun onHostDestroy() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostDestroy")
    }
    releasePlayer()
  }

  fun releasePlayer() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "releasePlayer")
    }
    player?.let {
      eventEmitter.removeListeners(it)
      adsApi.destroy()
      it.stop()
      player = null
    }
    playerView?.onDestroy()
    presentationManager?.onDestroy()
    reactContext.removeLifecycleEventListener(this)
  }

  fun setSource(source: ReadableMap?) {
    try {
      val sourceDescription = SourceAdapter().parseSourceFromJS(source)
      adsApi.setSource(sourceDescription)
      if (player != null && sourceDescription != null) {
        player?.source = sourceDescription
      }
    } catch (exception: THEOplayerException) {
      Log.e(TAG, exception.message ?: "")
      eventEmitter.emitError(exception)
    }
  }

  val selectedTextTrack: TextTrack?
    get() {
      return player?.let {
        for (track in it.textTracks) {
          if (track.mode == TextTrackMode.SHOWING) {
            return track
          }
        }
        null
      }
    }

  val selectedAudioTrack: MediaTrack<AudioQuality>?
    get() {
      return player?.let {
        for (track in it.audioTracks) {
          if (track.isEnabled) {
            return track
          }
        }
        null
      }
    }

  val selectedVideoTrack: MediaTrack<VideoQuality?>?
    get() {
      return player?.let {
        for (track in it.videoTracks) {
          if (track.isEnabled) {
            return track
          }
        }
        null
      }
    }
}
