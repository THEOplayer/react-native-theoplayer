package com.theoplayer

import android.annotation.SuppressLint
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.FrameLayout
import com.facebook.react.bridge.*
import com.theoplayer.track.TrackListAdapter.fromTextTrackList
import com.theoplayer.track.TrackListAdapter.fromTextTrack
import com.theoplayer.track.TrackListAdapter.fromTextTrackCue
import com.theoplayer.track.TrackListAdapter.fromAudioTrackList
import com.theoplayer.track.TrackListAdapter.fromVideoTrackList
import com.theoplayer.util.TypeUtils.encodeInfNan
import com.theoplayer.android.api.ads.ima.GoogleImaIntegrationFactory.createGoogleImaIntegration
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegrationFactory.createGoogleDaiIntegration
import com.theoplayer.android.api.cast.CastIntegrationFactory.createCastIntegration
import com.theoplayer.abr.ABRConfigurationAdapter.applyABRConfigurationFromProps
import com.facebook.react.uimanager.ThemedReactContext
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegration
import com.theoplayer.android.api.ads.ima.GoogleImaIntegration
import com.theoplayer.android.api.cast.CastIntegration
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.api.player.track.texttrack.TextTrack
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCue
import com.theoplayer.android.api.player.RequestCallback
import com.theoplayer.android.api.THEOplayerConfig
import com.google.ads.interactivemedia.v3.api.AdsRenderingSettings
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory
import com.theoplayer.source.SourceAdapter
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality
import com.theoplayer.android.api.cast.Cast
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack
import com.theoplayer.android.api.timerange.TimeRanges
import com.theoplayer.track.QualityListFilter
import java.lang.Exception

private const val TAG = "ReactTHEOplayerView"
private const val TIME_UNSET = Long.MIN_VALUE + 1

@SuppressLint("ViewConstructor")
class ReactTHEOplayerView(private val reactContext: ThemedReactContext) :
  FrameLayout(reactContext), LifecycleEventListener {

  private val eventEmitter: PlayerEventEmitter = PlayerEventEmitter(reactContext, this)
  private var playerView: THEOplayerView? = null
  private var abrConfig: ReadableMap? = null
  private var paused = false
  private var muted = false
  private var fullscreen = false
  private var playbackRate = 1.0
  private var volume = 1.0
  private var seekTime = TIME_UNSET.toDouble()
  private var sourceDescription: SourceDescription? = null
  private val mainHandler = Handler(Looper.getMainLooper())

  var daiIntegration: GoogleDaiIntegration? = null
  var imaIntegration: GoogleImaIntegration? = null
  var castIntegration: CastIntegration? = null
  val adsApi: AdsApiWrapper
  var player: Player? = null

  init {
    reactContext.addLifecycleEventListener(this)
    adsApi = AdsApiWrapper()
  }

  val castApi: Cast?
    get() = if (playerView != null) playerView!!.cast else null

  val textTrackInfo: WritableArray
    get() = if (player != null) {
      fromTextTrackList(player!!.textTracks)
    } else Arguments.createArray()

  fun initialize(configProps: ReadableMap?) {
    createViews(PlayerConfigAdapter().fromProps(configProps))
  }

  fun getTextTrackInfo(track: TextTrack): WritableMap {
    return if (player != null) {
      fromTextTrack(track)
    } else Arguments.createMap()
  }

  fun getTextTrackCueInfo(cue: TextTrackCue): WritableMap {
    return if (player != null) {
      fromTextTrackCue(cue)
    } else Arguments.createMap()
  }

  val audioTrackInfo: WritableArray
    get() = if (player != null) {
      fromAudioTrackList(player!!.audioTracks)
    } else Arguments.createArray()

  val videoTrackInfo: WritableArray
    get() = if (player != null) {
      fromVideoTrackList(player!!.videoTracks)
    } else Arguments.createArray()

  val duration: Double
    get() = encodeInfNan(if (player != null) 1e03 * player!!.duration else Double.NaN)

  fun getSeekableRange(callback: RequestCallback<TimeRanges?>) {
    if (player != null) {
      player!!.requestSeekable(callback)
    } else {
      callback.handleResult(null)
    }
  }

  override fun setId(id: Int) {
    super.setId(id)
    eventEmitter.setViewId(id)
  }

  private fun createViews(playerConfig: THEOplayerConfig) {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "Create views")
    }

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
    }.also {
      val layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      it.layoutParams = layoutParams
      addIntegrations(it, playerConfig)
      addView(it, 0, layoutParams)
    }
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
    // This ensures all props have been settled, to avoid async racing conditions.
    mainHandler.postDelayed({
      if (player == null) {
        player = playerView!!.player
        applyABRConfigurationFromProps(player, abrConfig)
        if (BuildConfig.EXTENSION_ADS) {
          adsApi.initialize(player!!, imaIntegration, daiIntegration)
        }
        eventEmitter.attachListeners(player!!)
        player?.isMuted = muted
        player?.volume = volume
        player?.playbackRate = playbackRate
        setSource(sourceDescription)
        if (!paused) {
          player?.play()
        }
        if (seekTime != TIME_UNSET.toDouble()) {
          seekTo(seekTime)
        }
      }
    }, 1)
  }

  override fun onHostResume() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostResume")
    }
    playerView?.onResume()
  }

  override fun onHostPause() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostPause")
    }
    playerView?.onPause()
  }

  override fun onHostDestroy() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostDestroy")
    }
    cleanUpResources()
  }

  fun cleanUpResources() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "cleanUpResources")
    }
    releasePlayer()
  }

  private fun releasePlayer() {
    player?.let {
      eventEmitter.removeListeners(it)
      adsApi.destroy()
      it.stop()
      player = null
    }
    playerView?.onDestroy()
    reactContext.removeLifecycleEventListener(this)
  }

  fun setSource(source: ReadableMap?) {
    try {
      setSource(SourceAdapter().parseSourceFromJS(source!!))
    } catch (exception: THEOplayerException) {
      Log.e(TAG, exception.message!!)
      eventEmitter.emitError(exception)
    }
  }

  fun setABRConfig(abrConfigProps: ReadableMap?) {
    abrConfig = abrConfigProps
    applyABRConfigurationFromProps(player, abrConfig)
  }

  fun setSource(sourceDescription: SourceDescription?) {
    this.sourceDescription = sourceDescription
    adsApi.setSource(sourceDescription)
    if (player != null && sourceDescription != null) {
      player!!.source = sourceDescription
    }
  }

  fun setPaused(paused: Boolean) {
    this.paused = paused
    if (player != null) {
      val playerIsPaused = player!!.isPaused
      if (!paused && playerIsPaused) {
        applyPaused(false)
      } else if (paused && (!playerIsPaused || adsApi.isPlaying)) {
        applyPaused(true)
      } else {
        // The player's paused state is out-of-sync, this shouldn't happen.
        Log.w(TAG, "paused stated out-of-sync")
        applyPaused(paused)
      }
    }
  }

  private fun applyPaused(paused: Boolean) {
    if (paused) {
      player?.pause()
    } else {
      player?.play()
    }
  }

  fun setMuted(muted: Boolean) {
    this.muted = muted
    player?.isMuted = muted
  }

  fun setVolume(volume: Double) {
    this.volume = volume
    player?.volume = volume
  }

  fun setPlaybackRate(playbackRate: Double) {
    this.playbackRate = playbackRate
    player?.playbackRate = playbackRate
  }

  fun seekTo(seekTime: Double) {
    this.seekTime = seekTime
    player?.let {
      it.currentTime = 1e-03 * seekTime

      // reset once used
      this.seekTime = TIME_UNSET.toDouble()
    }
  }

  val selectedTextTrack: TextTrack?
    get() {
      if (player != null) {
        val tracks = player!!.textTracks
        for (i in 0 until tracks.length()) {
          val track = tracks.getItem(i)
          if (track.mode == TextTrackMode.SHOWING) {
            return track
          }
        }
      }
      return null
    }

  fun setSelectedTextTrack(uid: Int) {
    if (player != null) {
      for (track in player!!.textTracks) {
        if (track.uid == uid) {
          track.mode = TextTrackMode.SHOWING
        } else if (track.mode == TextTrackMode.SHOWING) {
          track.mode = TextTrackMode.DISABLED
        }
      }
    }
  }

  val selectedAudioTrack: MediaTrack<AudioQuality>?
    get() {
      if (player != null) {
        val tracks = player!!.audioTracks
        for (i in 0 until tracks.length()) {
          val track = tracks.getItem(i)
          if (track.isEnabled) {
            return track
          }
        }
      }
      return null
    }

  fun setSelectedAudioTrack(uid: Int) {
    if (player != null) {
      for (track in player!!.audioTracks) {
        track.isEnabled = track.uid == uid
      }
    }
  }

  val selectedVideoTrack: MediaTrack<VideoQuality?>?
    get() {
      if (player != null) {
        val tracks = player!!.videoTracks
        for (i in 0 until tracks.length()) {
          val track = tracks.getItem(i)
          if (track.isEnabled) {
            return track
          }
        }
      }
      return null
    }

  fun setSelectedVideoTrack(uid: Int) {
    if (player != null) {
      for (track in player!!.videoTracks) {
        track.isEnabled = track.uid == uid
      }
    }
  }

  fun setTargetVideoQualities(uids: ReadableArray) {
    val currentVideoTrack = selectedVideoTrack as MediaTrack<VideoQuality>?
    if (currentVideoTrack != null) {
      if (uids.size() == 0) {
        // Reset target qualities when passing empty list.
        currentVideoTrack.setTargetQuality(null)
      } else {
        currentVideoTrack.qualities?.let {
          currentVideoTrack.targetQualities = QualityListFilter(it).filterQualityList(uids)
        }
      }
    }
  }

  @SuppressLint("ObsoleteSdkInt")
  fun setFullscreen(fullscreen: Boolean) {
    if (fullscreen == this.fullscreen) {
      return  // Avoid generating events when nothing is changing
    }
    this.fullscreen = fullscreen
    val activity = reactContext.currentActivity ?: return
    val window = activity.window
    val decorView = window.decorView
    val uiOptions: Int
    if (fullscreen) {
      uiOptions = if (Build.VERSION.SDK_INT >= 19) { // 4.4+
        (SYSTEM_UI_FLAG_HIDE_NAVIGATION
          or SYSTEM_UI_FLAG_IMMERSIVE_STICKY
          or SYSTEM_UI_FLAG_FULLSCREEN)
      } else {
        (SYSTEM_UI_FLAG_HIDE_NAVIGATION
          or SYSTEM_UI_FLAG_FULLSCREEN)
      }
      eventEmitter.onFullscreenWillPresent()
      decorView.systemUiVisibility = uiOptions
      eventEmitter.onFullscreenDidPresent()
    } else {
      uiOptions = SYSTEM_UI_FLAG_VISIBLE
      eventEmitter.onFullscreenWillDismiss()
      decorView.systemUiVisibility = uiOptions
      eventEmitter.onFullscreenDidDismiss()
    }
  }
}
