package com.theoplayer

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
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
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.player.*
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.connector.mediasession.MediaSessionConnector
import com.theoplayer.audio.BackgroundAudioConfig
import com.theoplayer.audio.MediaPlaybackService
import java.util.concurrent.atomic.AtomicBoolean

private const val TAG = "ReactTHEOplayerContext"
private const val USE_PLAYBACK_SERVICE = true

class ReactTHEOplayerContext(
  private val reactContext: ThemedReactContext,
  playerConfig: THEOplayerConfig
) {
  private val mainHandler = Handler(Looper.getMainLooper())
  private var isBound = AtomicBoolean()
  private var binder: MediaPlaybackService.MediaPlaybackBinder? = null
  private var mediaSessionConnector: MediaSessionConnector? = null

  var backgroundAudioConfig: BackgroundAudioConfig = BackgroundAudioConfig(false)
    set(value) {
      updateBackgroundPlayback(value, field)
      field = value
    }

  lateinit var playerView: THEOplayerView

  val player: Player
    get() = playerView.player

  var daiIntegration: GoogleDaiIntegration? = null
  var imaIntegration: GoogleImaIntegration? = null
  var castIntegration: CastIntegration? = null

  companion object {
    private var mediaControlledInstance: ReactTHEOplayerContext? = null
  }

  private val connection = object : ServiceConnection {
    override fun onServiceConnected(className: ComponentName, service: IBinder) {
      binder = service as MediaPlaybackService.MediaPlaybackBinder

      // Get media session
      mediaSessionConnector = binder?.mediaSessionConnector
      mediaSessionConnector?.player = player
      mediaSessionConnector?.setMediaSessionMetadata(player.source)

      // Pass player context
      binder?.setPlayerContext(this@ReactTHEOplayerContext)
    }

    override fun onServiceDisconnected(className: ComponentName?) {
      binder = null
    }
  }

  init {
    createPlayerView(reactContext, playerConfig)
  }

  private fun updateBackgroundPlayback(
    config: BackgroundAudioConfig,
    oldConfig: BackgroundAudioConfig
  ) {
    if (config.enabled == oldConfig.enabled) {
      return
    }
    // TODO
  }

  private fun bindMediaPlaybackService() {
    // Bind to an existing service, if available
    // A bound service runs only as long as another application component is bound to it.
    // Multiple components can bind to the service at once, but when all of them unbind, the
    // service is destroyed.
    if (!isBound.get()) {
      isBound.set(
        reactContext.bindService(
          Intent(reactContext, MediaPlaybackService::class.java),
          connection,
          Context.BIND_AUTO_CREATE
        )
      )
    }
  }

  private fun unbindMediaPlaybackService() {
    // This client is done interacting with the service: unbind.
    // When there are no clients bound to the service, the system destroys the service.
    if (binder?.isBinderAlive == true) {
      if (isBound.getAndSet(false)) {
        reactContext.unbindService(connection)
      }
    }
  }

  private fun createPlayerView(reactContext: ThemedReactContext, playerConfig: THEOplayerConfig) {
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

    // By default, the screen should remain on.
    playerView.keepScreenOn = true

    addIntegrations(playerConfig)
    addListeners()

    if (mediaControlledInstance == null) {
      mediaControlledInstance = this
      if (!USE_PLAYBACK_SERVICE) {
        initDefaultMediaSession()
      }
    }
  }

  private fun initDefaultMediaSession() {
    // Destroy any existent media session
    mediaSessionConnector?.destroy()

    // Create and initialize the media session
    val mediaSession = MediaSessionCompat(reactContext, TAG)

    // Do not let MediaButtons restart the player when the app is not visible
    mediaSession.setMediaButtonReceiver(null)

    // Create a MediaSessionConnector and attach the THEOplayer instance.
    mediaSessionConnector = MediaSessionConnector(mediaSession).apply {
      debug = BuildConfig.LOG_MEDIASESSION_EVENTS
      player = this@ReactTHEOplayerContext.player

      // Set mediaSession active
      setActive(true)
    }
  }

  private fun addIntegrations(playerConfig: THEOplayerConfig) {
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

  private val onSourceChange = EventListener<SourceChangeEvent> {
    if (backgroundAudioConfig.enabled) {
      binder?.updateNotification()
    }
  }

  private val onLoadedMetadata = EventListener<LoadedMetadataEvent> {
    if (backgroundAudioConfig.enabled) {
      binder?.updateNotification()
    }
  }

  private val onPlay = EventListener<PlayEvent> {
    if (USE_PLAYBACK_SERVICE && mediaControlledInstance == this) {
      bindMediaPlaybackService()
    }

    if (backgroundAudioConfig.enabled) {
      binder?.updateNotification(PlaybackStateCompat.STATE_PLAYING)
    }
  }

  private val onPause = EventListener<PauseEvent> {
    if (backgroundAudioConfig.enabled) {
      binder?.updateNotification(PlaybackStateCompat.STATE_PAUSED)
    }
  }

  private fun addListeners() {
    player.apply {
      addEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
      addEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
      addEventListener(PlayerEventTypes.PAUSE, onPause)
      addEventListener(PlayerEventTypes.PLAY, onPlay)
    }
  }

  private fun removeListeners() {
    player.apply {
      removeEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
      removeEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
      removeEventListener(PlayerEventTypes.PAUSE, onPause)
      removeEventListener(PlayerEventTypes.PLAY, onPlay)
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
    if (!backgroundAudioConfig.enabled) {
      mediaSessionConnector?.setActive(false)
      playerView.onPause()
    }
  }

  /**
   * The host activity is resumed.
   */
  fun onHostResume() {
    if (!backgroundAudioConfig.enabled) {
      mediaSessionConnector?.setActive(true)
      playerView.onResume()
    }
  }

  fun destroy() {
    removeListeners()
    if (mediaControlledInstance == this) {
      if (USE_PLAYBACK_SERVICE) {
        binder?.stopForegroundService()
        unbindMediaPlaybackService()
      }
      mediaControlledInstance = null
    }
    mediaSessionConnector?.destroy()
    playerView.onDestroy()
  }
}
