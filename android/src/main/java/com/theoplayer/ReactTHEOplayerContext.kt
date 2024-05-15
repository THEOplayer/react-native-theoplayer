package com.theoplayer

import android.app.UiModeManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.content.res.Configuration
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import android.util.Log
import com.facebook.react.uimanager.ThemedReactContext
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
import com.theoplayer.media.MediaSessionConfig
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
  private val reactContext: ThemedReactContext,
  private val configAdapter: PlayerConfigAdapter
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

  var mediaSessionConfig: MediaSessionConfig = configAdapter.mediaSessionConfig()
    set(value) {
      applyMediaSessionConfig(mediaSessionConnector, value)
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
  private var isHostPaused: Boolean = false

  private val isBackgroundAudioEnabled: Boolean
    get() = backgroundAudioConfig.enabled
  private val isTV: Boolean
    get() = uiModeManager?.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION

  companion object {
    fun create(
      reactContext: ThemedReactContext,
      configAdapter: PlayerConfigAdapter
    ): ReactTHEOplayerContext {
      return ReactTHEOplayerContext(reactContext, configAdapter).apply {
        initializePlayerView()
      }
    }
  }

  private val connection = object : ServiceConnection {
    override fun onServiceConnected(className: ComponentName, service: IBinder) {
      binder = service as MediaPlaybackService.MediaPlaybackBinder

      // Get media session connector from service
      mediaSessionConnector = binder?.mediaSessionConnector?.also {
        applyMediaSessionConfig(it, mediaSessionConfig)
      }

      // Pass player context
      binder?.setPlayerContext(this@ReactTHEOplayerContext)

      // Apply background audio config
      binder?.setEnablePlaybackControls(backgroundAudioConfig.enabled)
    }

    override fun onServiceDisconnected(className: ComponentName?) {
      binder = null
    }
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
        // Enable & bind background playback
        bindMediaPlaybackService()
      } else if (prevConfig?.enabled == true) {
        // Stop & unbind MediaPlaybackService.
        binder?.stopForegroundService()
        unbindMediaPlaybackService()

        // Create a new media session.
        initDefaultMediaSession()

        // If the app is currently backgrounded, apply state changes.
        if (isHostPaused) {
          applyHostPaused()
        }
      }
    }
  }

  private fun applyAllowedMediaControls() {
    // Reduce allowed set of remote control playback actions for ads & live streams.
    val isLive = player.duration.isInfinite()
    val isInAd = player.ads.isPlaying
    mediaSessionConnector?.enabledPlaybackActions = when {
      isInAd || isLive && !isTV -> 0
      isLive && isTV -> ALLOWED_PLAYBACK_ACTIONS xor
        PlaybackStateCompat.ACTION_FAST_FORWARD xor
        PlaybackStateCompat.ACTION_REWIND
      else -> ALLOWED_PLAYBACK_ACTIONS
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

  private fun initializePlayerView() {
    playerView = object : THEOplayerView(reactContext.currentActivity!!, configAdapter.playerConfig()) {
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

    addIntegrations()
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
    mediaSessionConnector = MediaSessionConnector(mediaSession).also {
      applyMediaSessionConfig(it, mediaSessionConfig)
    }
  }

  private fun applyMediaSessionConfig(connector: MediaSessionConnector?, config: MediaSessionConfig) {
    connector?.apply {
      debug = BuildConfig.LOG_MEDIASESSION_EVENTS

      player = this@ReactTHEOplayerContext.player

      // Set mediaSession active and ready to receive media button events, but not if the player
      // is backgrounded.
      setActive(!isHostPaused && BuildConfig.EXTENSION_MEDIASESSION && config.mediaSessionEnabled)

      skipForwardInterval = config.skipForwardInterval
      skipBackwardsInterval = config.skipBackwardInterval

      // Pass metadata from source description
      setMediaSessionMetadata(player?.source)
    }
  }

  private fun addIntegrations() {
    try {
      if (BuildConfig.EXTENSION_GOOGLE_IMA) {
        imaIntegration = GoogleImaIntegrationFactory.createGoogleImaIntegration(
          playerView, configAdapter.imaSdkSettings()
        ).apply {
          setAdsRenderingSettings(configAdapter.adsRenderSettings())
        }.also {
          playerView.player.addIntegration(it)
        }
      }
    } catch (e: Exception) {
      Log.w(TAG, "Failed to configure Google IMA integration ${e.message}")
    }
    try {
      if (BuildConfig.EXTENSION_GOOGLE_DAI) {
        daiIntegration = GoogleDaiIntegrationFactory.createGoogleDaiIntegration(
          playerView, configAdapter.imaSdkSettings()
        ).apply {
          setAdsRenderingSettings(configAdapter.adsRenderSettings())
        }.also {
          playerView.player.addIntegration(it)
        }
      }
    } catch (e: Exception) {
      Log.w(TAG, "Failed to configure Google DAI integration ${e.message}")
    }
    try {
      if (BuildConfig.EXTENSION_CAST) {
        castIntegration = CastIntegrationFactory.createCastIntegration(
          playerView, configAdapter.castConfig()
        ).also {
          playerView.player.addIntegration(it)
        }
      }
    } catch (e: Exception) {
      Log.w(TAG, "Failed to configure Cast integration ${e.message}")
    }
    // Add other future integrations here.
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

  private val onEnded = EventListener<EndedEvent> {
    // Playback has ended, we can abandon audio focus.
    audioFocusManager?.abandonAudioFocus()
  }

  private fun addListeners() {
    player.apply {
      addEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
      addEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
      addEventListener(PlayerEventTypes.PAUSE, onPause)
      addEventListener(PlayerEventTypes.PLAY, onPlay)
      addEventListener(PlayerEventTypes.ENDED, onEnded)
    }
  }

  private fun removeListeners() {
    player.apply {
      removeEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
      removeEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
      removeEventListener(PlayerEventTypes.PAUSE, onPause)
      removeEventListener(PlayerEventTypes.PLAY, onPlay)
      removeEventListener(PlayerEventTypes.ENDED, onEnded)
    }
  }

  /**
   * The host activity is paused.
   */
  fun onHostPause() {
    isHostPaused = true
    applyHostPaused()
  }

  private fun applyHostPaused() {
    // Keep current playing state when going to background
    wasPlayingOnHostPause = !player.isPaused
    playerView.onPause()
    if (!isBackgroundAudioEnabled) {
      mediaSessionConnector?.setActive(false)

      // The player pauses and goes to the background, we can abandon audio focus.
      audioFocusManager?.abandonAudioFocus()
    }
  }

  /**
   * The host activity is resumed.
   */
  fun onHostResume() {
    isHostPaused = false
    mediaSessionConnector?.setActive(BuildConfig.EXTENSION_MEDIASESSION)
    playerView.onResume()
    if (!player.isPaused) {
      audioFocusManager?.retrieveAudioFocus()
    }
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
