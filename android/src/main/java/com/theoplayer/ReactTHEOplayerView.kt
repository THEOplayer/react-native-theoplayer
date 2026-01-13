package com.theoplayer

import android.annotation.SuppressLint
import android.util.Log
import android.view.ViewGroup
import android.widget.FrameLayout
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ThemedReactContext
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper
import com.theoplayer.android.api.cast.Cast
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.player.Player
import com.theoplayer.broadcast.EventBroadcastAdapter
import com.theoplayer.presentation.PresentationManager
import com.theoplayer.source.SourceAdapter

private const val TAG = "ReactTHEOplayerView"

@SuppressLint("ViewConstructor")
class ReactTHEOplayerView(private val reactContext: ThemedReactContext) :
  FrameLayout(reactContext), LifecycleEventListener {

  // Set true to bypass ReactNative lifecycle, avoiding THEOplayerView being disposed by Fabric
  var bypassDropInstanceOnReactLifecycle = false
  val eventEmitter: PlayerEventEmitter =
    PlayerEventEmitter(reactContext.reactApplicationContext, this)
  val broadcast = EventBroadcastAdapter(this)
  var presentationManager: PresentationManager? = null
  var playerContext: ReactTHEOplayerContext? = null
  var isInitialized: Boolean = false
    private set
  private var config: PlayerConfigAdapter? = null

  val adsApi: AdsApiWrapper

  val castApi: Cast?
    get() = playerContext?.playerView?.cast

  val player: Player?
    get() = playerContext?.player

  init {
    reactContext.addLifecycleEventListener(this)
    adsApi = AdsApiWrapper()
  }

  fun initialize(config: PlayerConfigAdapter) {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "Initialize view")
    }
    if (isInitialized) {
      Log.w(TAG, "Already initialized view")
      return
    }
    this.config = config
    if (!isAttachedToWindow && BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // The view is not attached to the window yet, postpone the initialization.
      return
    }
    isInitialized = true
    playerContext = ReactTHEOplayerContext.create(
      reactContext,
      config
    )
    playerContext?.apply {
      adsApi.initialize(player, imaIntegration, daiIntegration)
      val layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      playerView.layoutParams = layoutParams
      (playerView.parent as? ViewGroup)?.removeView(playerView)
      addView(playerView, 0, layoutParams)
      presentationManager = PresentationManager(
        this,
        reactContext,
        eventEmitter
      )
      eventEmitter.preparePlayer(player)
    }
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    if (!isInitialized && BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      config?.let { initialize(it) }
    }
  }

  override fun setId(id: Int) {
    super.setId(id)
    eventEmitter.setViewId(id)
  }

  /**
   * Called when host activity receives pause event (e.g. {@link Activity#onPause}. Always called
   * for the most current activity.
   */
  override fun onHostPause() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostPause")
    }
    playerContext?.onHostPause()
  }

  /**
   * Called either when the host activity receives a resume event (e.g. {@link Activity#onResume} or
   * if the native module that implements this is initialized while the host activity is already
   * resumed. Always called for the most current activity.
   */
  override fun onHostResume() {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "onHostResume")
    }
    playerContext?.onHostResume()
  }

  /**
   * Called when host activity receives destroy event (e.g. {@link Activity#onDestroy}. Only called
   * for the last React activity to be destroyed.
   */
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
    reactContext.removeLifecycleEventListener(this)
    adsApi.destroy()

    if (isInitialized) {
      eventEmitter.removeListeners(player)
      presentationManager?.destroy()
      playerContext?.destroy()
      isInitialized = false
    }
  }

  fun setSource(source: ReadableMap?) {
    try {
      val sourceDescription = SourceAdapter().parseSourceFromJS(source)
      adsApi.setSource(sourceDescription)
      player?.source = sourceDescription
    } catch (exception: THEOplayerException) {
      Log.e(TAG, exception.message ?: "")
      eventEmitter.emitError(exception)
    }
  }
}
