package com.theoplayer

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import com.facebook.react.uimanager.ThemedReactContext
import com.google.ads.interactivemedia.v3.api.AdsRenderingSettings
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory
import com.theoplayer.android.api.THEOplayerConfig
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegration
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegrationFactory
import com.theoplayer.android.api.ads.ima.GoogleImaIntegration
import com.theoplayer.android.api.ads.ima.GoogleImaIntegrationFactory
import com.theoplayer.android.api.cast.CastIntegration
import com.theoplayer.android.api.cast.CastIntegrationFactory
import com.theoplayer.android.api.event.player.PlayEvent
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.player.Player
import com.theoplayer.audio.AudioBecomingNoisyManager
import com.theoplayer.audio.MediaPlaybackService
import com.theoplayer.mediasession.MediaSessionIntegration
import java.util.concurrent.atomic.AtomicBoolean

private const val TAG = "ReactTHEOplayerContext"

class ReactTHEOplayerContext private constructor(
  private val reactContext: ThemedReactContext,
  playerConfig: THEOplayerConfig,
  private var backgroundAudioMode: Boolean
) {
  private val mainHandler = Handler(Looper.getMainLooper())
  private var isBound = AtomicBoolean()
  private var binder: MediaPlaybackService.MediaPlaybackBinder? = null

  lateinit var playerView: THEOplayerView
  lateinit var mediaSessionIntegration: MediaSessionIntegration
  lateinit var audioBecomingNoisyManager: AudioBecomingNoisyManager

  val player: Player
    get() = playerView.player

  var daiIntegration: GoogleDaiIntegration? = null
  var imaIntegration: GoogleImaIntegration? = null
  var castIntegration: CastIntegration? = null

  companion object {
    var instance: ReactTHEOplayerContext? = null

    fun create(
      reactContext: ThemedReactContext,
      playerConfig: THEOplayerConfig,
      backgroundAudioMode: Boolean
    ): ReactTHEOplayerContext {
      // Reuse existing context, if available
      val ctx = instance ?: ReactTHEOplayerContext(reactContext, playerConfig, backgroundAudioMode)

      // Optionally keep this instance for background playback
      if (backgroundAudioMode) {
        instance = ctx
      }
      return ctx
    }
  }

  private val connection = object : ServiceConnection {
    override fun onServiceConnected(className: ComponentName, service: IBinder) {
      Log.d(TAG, "onServiceConnected")
      binder = service as MediaPlaybackService.MediaPlaybackBinder
    }

    override fun onServiceDisconnected(arg0: ComponentName) {
      Log.d(TAG, "onServiceDisconnected")
    }
  }

  init {
    createPlayerView(reactContext, playerConfig)
  }

  private fun bindMediaPlaybackService(reactContext: ThemedReactContext) {
    Log.d(TAG, "BIND MediaPlaybackService")
    // Bind to an existing service, if available
    // A bound service runs only as long as another application component is bound to it.
    // Multiple components can bind to the service at once, but when all of them unbind, the
    // service is destroyed.
    if (!isBound.get()) {
      isBound.set(reactContext.bindService(
          Intent(reactContext, MediaPlaybackService::class.java),
          connection,
          Context.BIND_AUTO_CREATE
        )
      )
    }
  }

  private fun unbindMediaPlaybackService() {
    Log.d(TAG, "UNBIND MediaPlaybackService")
    // This client is done interacting with the service: unbind.
    // When there are no clients bound to the service, the system destroys the service.
    if (binder?.isBinderAlive == true) {
      if (isBound.getAndSet(false)) {
        reactContext.unbindService(connection)
      }
    }
  }

  private fun createPlayerView(reactContext: ThemedReactContext, playerConfig: THEOplayerConfig) {
    Log.d(TAG, "createPlayerView")
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
    }
    addIntegrations(reactContext, playerConfig)
    addListeners()
    audioBecomingNoisyManager = AudioBecomingNoisyManager(reactContext) {
      player.pause()
    }
  }

  private fun addIntegrations(reactContext: ThemedReactContext, playerConfig: THEOplayerConfig) {
    mediaSessionIntegration = MediaSessionIntegration(reactContext, playerView.player)

    try {
      if (BuildConfig.EXTENSION_GOOGLE_IMA) {
        imaIntegration = GoogleImaIntegrationFactory.createGoogleImaIntegration(playerView).apply {
          setAdsRenderingSettings(createRenderSettings(playerConfig))
          playerView.player.addIntegration(this)
        }
      }
    } catch (ignore: Exception) {
    }
    try {
      if (BuildConfig.EXTENSION_GOOGLE_DAI) {
        daiIntegration = GoogleDaiIntegrationFactory.createGoogleDaiIntegration(playerView).apply {
          setAdsRenderingSettings(createRenderSettings(playerConfig))
          playerView.player.addIntegration(this)
        }
      }
    } catch (ignore: Exception) {
    }
    try {
      if (BuildConfig.EXTENSION_CAST) {
        castIntegration = CastIntegrationFactory.createCastIntegration(playerView).apply {
          playerView.player.addIntegration(this)
        }
      }
      // Add other future integrations here.
    } catch (ignore: Exception) {
    }
  }

  private fun addListeners() {
    player.apply {
      addEventListener(PlayerEventTypes.PLAY, this@ReactTHEOplayerContext::onPlay)
    }
  }

  private fun removeListeners() {
    player.apply {
      removeEventListener(PlayerEventTypes.PLAY, this@ReactTHEOplayerContext::onPlay)
    }
  }

  private fun onPlay(event: PlayEvent) {
    if (backgroundAudioMode) {
      bindMediaPlaybackService(reactContext)
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

  /**
   * The host activity is paused.
   */
  fun onHostPause() {
    Log.d(TAG, "onHostPause")
    if (!backgroundAudioMode) {
      mediaSessionIntegration.onPause()
      playerView.onPause()
    }
  }

  /**
   * The host activity is resumed.
   */
  fun onHostResume() {
    Log.d(TAG, "onHostResume")
    if (!backgroundAudioMode) {
      mediaSessionIntegration.onResume()
      playerView.onResume()
    }
  }

  /**
   * The host activity is destroyed.
   *
   * - without backgroundAudioMode: destroy the player.
   * - with backgroundAudioMode: unbind from the MediaPlaybackService.
   */
  fun onHostDestroy() {
    Log.d(TAG, "onHostDestroy")
    if (!backgroundAudioMode) {
      destroy()
    } else {
      unbindMediaPlaybackService()
    }
  }

  private fun destroy() {
    Log.d(TAG, "destroy")
    removeListeners()
    mediaSessionIntegration.onDestroy()
    playerView.onDestroy()
  }
}
