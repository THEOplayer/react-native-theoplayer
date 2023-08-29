package com.theoplayer

import android.app.UiModeManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.content.pm.PackageManager
import android.content.res.Configuration
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
import com.theoplayer.audio.AudioBecomingNoisyManager
import com.theoplayer.audio.AudioFocusManager
import com.theoplayer.audio.BackgroundAudioConfig
import com.theoplayer.media.MediaPlaybackService
import java.util.concurrent.atomic.AtomicBoolean

private const val TAG = "ReactTHEOplayerContext"

private const val ALLOWED_PLAYBACK_ACTIONS = (
  PlaybackStateCompat.ACTION_PLAY_PAUSE or
    PlaybackStateCompat.ACTION_PLAY or
    PlaybackStateCompat.ACTION_PAUSE or
    PlaybackStateCompat.ACTION_SEEK_TO or
    PlaybackStateCompat.ACTION_FAST_FORWARD or
    PlaybackStateCompat.ACTION_REWIND or
    PlaybackStateCompat.ACTION_SET_PLAYBACK_SPEED)

class ReactTHEOplayerContext private constructor(
  private val reactContext: ThemedReactContext
) {
  private val mainHandler = Handler(Looper.getMainLooper())
  private var isBound = AtomicBoolean()
  private var binder: MediaPlaybackService.MediaPlaybackBinder? = null
  private var mediaSessionConnector: MediaSessionConnector? = null
  private var audioBecomingNoisyManager = AudioBecomingNoisyManager(reactContext) {
    // Audio is about to become 'noisy' due to a change in audio outputs: pause the player
    player.pause()
  }
  private var audioFocusManager: AudioFocusManager? = null

  var backgroundAudioConfig: BackgroundAudioConfig = BackgroundAudioConfig(enabled = false)
    set(value) {
      applyBackgroundPlaybackConfig(value, field)
      field = value
    }

  lateinit var playerView: THEOplayerView

  val player: Player
    get() = playerView.player

  private val uiModeManager by lazy {
      reactContext.getSystemService(Context.UI_MODE_SERVICE) as? UiModeManager
  }

  var daiIntegration: GoogleDaiIntegration? = null
  var imaIntegration: GoogleImaIntegration? = null
  var castIntegration: CastIntegration? = null
  var wasPlayingOnHostPause: Boolean = false

  private val isBackgroundAudioEnabled: Boolean
    get() = backgroundAudioConfig.enabled
  private val isTV: Boolean
    get() = uiModeManager?.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION

  companion object {
    fun create(
      reactContext: ThemedReactContext,
      playerConfig: THEOplayerConfig
    ): ReactTHEOplayerContext {
      return ReactTHEOplayerContext(reactContext).apply {
        initializePlayerView(playerConfig)
      }
    }
  }

  private val connection = object : ServiceConnection {
    override fun onServiceConnected(className: ComponentName, service: IBinder) {
      binder = service as MediaPlaybackService.MediaPlaybackBinder

      // Get media session connector from service
      mediaSessionConnector = binder?.mediaSessionConnector
      mediaSessionConnector?.player = player
      mediaSessionConnector?.setMediaSessionMetadata(player.source)

      // Pass player context
      binder?.setPlayerContext(this@ReactTHEOplayerContext)

      // Apply background audio config
      binder?.setEnablePlaybackControls(backgroundAudioConfig.enabled)
    }

    override fun onServiceDisconnected(className: ComponentName?) {
      binder = null
    }
  }

  private fun setPlaybackServiceEnabled(enabled: Boolean) {
    reactContext.applicationContext.packageManager.setComponentEnabledSetting(
      ComponentName(reactContext.applicationContext, MediaPlaybackService::class.java),
      if (enabled) PackageManager.COMPONENT_ENABLED_STATE_ENABLED
      else PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
      PackageManager.DONT_KILL_APP
    )
  }

  private fun applyBackgroundPlaybackConfig(
    config: BackgroundAudioConfig,
    prevConfig: BackgroundAudioConfig?
  ) {
    playerView.settings.setAllowBackgroundPlayback(config.enabled)

    if (prevConfig?.enabled == config.enabled) {
      // No changes
      return
    }

    if (BuildConfig.USE_PLAYBACK_SERVICE) {
      if (prevConfig?.enabled != true && config.enabled) {
        // Enabling background playback
        setPlaybackServiceEnabled(true)
        bindMediaPlaybackService()
      } else if (prevConfig?.enabled == true) {
        // Disabling background playback
        binder?.stopForegroundService()
        unbindMediaPlaybackService()
        setPlaybackServiceEnabled(false)
        initDefaultMediaSession()
      }
    }
  }

  private fun applyAllowedMediaControls() {
    // Reduce allowed set of remote control playback actions for ads & live streams.
    val isLive = player.duration.isInfinite()
    val isInAd = player.ads.isPlaying
    mediaSessionConnector?.enabledPlaybackActions = if (isInAd || isLive && !isTV) {
      0
    } else {
      ALLOWED_PLAYBACK_ACTIONS
    }
  }

  private fun bindMediaPlaybackService() {
    // Bind to an existing service, if available
    // A bound service runs only as long as another application component is bound to it.
    // Multiple components can bind to the service at once, but when all of them unbind, the
    // service is destroyed.
    if (!isBound.get()) {
      // Clean-up any existing media session connector
      mediaSessionConnector?.destroy()

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
    binder = null
  }

  private fun initializePlayerView(playerConfig: THEOplayerConfig) {
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

    audioFocusManager = AudioFocusManager(reactContext, player)

    if (!BuildConfig.USE_PLAYBACK_SERVICE || !isBackgroundAudioEnabled) {
      initDefaultMediaSession()
    }

    // Apply initial backgroundPlayback config
    applyBackgroundPlaybackConfig(backgroundAudioConfig, null)
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
    mediaSessionConnector?.setMediaSessionMetadata(player.source)
    binder?.updateNotification()
    applyAllowedMediaControls()
  }

  private val onLoadedMetadata = EventListener<LoadedMetadataEvent> {
    binder?.updateNotification()
    applyAllowedMediaControls()
  }

  private val onPlay = EventListener<PlayEvent> {
    if (BuildConfig.USE_PLAYBACK_SERVICE && isBackgroundAudioEnabled) {
      bindMediaPlaybackService()
    }
    binder?.updateNotification(PlaybackStateCompat.STATE_PLAYING)
    applyAllowedMediaControls()
    audioBecomingNoisyManager.setEnabled(true)
    audioFocusManager?.retrieveAudioFocus()
  }

  private val onPause = EventListener<PauseEvent> {
    binder?.updateNotification(PlaybackStateCompat.STATE_PAUSED)
    applyAllowedMediaControls()
    audioBecomingNoisyManager.setEnabled(false)
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
    // Keep current playing state when going to background
    wasPlayingOnHostPause = !player.isPaused
    playerView.onPause()
    if (!isBackgroundAudioEnabled) {
      mediaSessionConnector?.setActive(false)
    }
  }

  /**
   * The host activity is resumed.
   */
  fun onHostResume() {
    mediaSessionConnector?.setActive(true)
    playerView.onResume()
    audioFocusManager?.retrieveAudioFocus()
  }

  fun destroy() {
    if (BuildConfig.USE_PLAYBACK_SERVICE) {
      removeListeners()

      // Remove service from foreground
      binder?.stopForegroundService()

      // Unbind client from background service so it can stop
      unbindMediaPlaybackService()
    }
    audioFocusManager?.abandonAudioFocus()
    mediaSessionConnector?.destroy()
    playerView.onDestroy()
  }
}
