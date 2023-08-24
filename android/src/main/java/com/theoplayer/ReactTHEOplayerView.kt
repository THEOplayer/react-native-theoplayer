package com.theoplayer

import android.annotation.SuppressLint
import android.content.*
import android.util.Log
import android.view.ViewGroup
import android.widget.FrameLayout
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ThemedReactContext
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper
import com.theoplayer.android.api.cast.Cast
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.player.Player
import com.theoplayer.presentation.PresentationManager
import com.theoplayer.source.SourceAdapter

private const val TAG = "ReactTHEOplayerView"

@SuppressLint("ViewConstructor")
class ReactTHEOplayerView(private val reactContext: ThemedReactContext) :
  FrameLayout(reactContext), LifecycleEventListener {

  private val eventEmitter: PlayerEventEmitter =
    PlayerEventEmitter(reactContext.reactApplicationContext, this)

  var presentationManager: PresentationManager? = null
  var playerContext: ReactTHEOplayerContext? = null
  private var isInitialized: Boolean = false

  val adsApi: AdsApiWrapper

  val castApi: Cast?
    get() = playerContext?.playerView?.cast

  val player: Player?
    get() = playerContext?.player

  init {
    reactContext.addLifecycleEventListener(this)
    adsApi = AdsApiWrapper()
  }

  fun initialize(configProps: ReadableMap?) {
    if (BuildConfig.LOG_VIEW_EVENTS) {
      Log.d(TAG, "Initialize view")
    }
    if (isInitialized) {
      Log.w(TAG, "Already initialized view")
      return
    }
    isInitialized = true
    playerContext = ReactTHEOplayerContext.create(
      reactContext,
      PlayerConfigAdapter.theoConfigFromProps(configProps)
    )
    playerContext?.let {
      if (BuildConfig.EXTENSION_ADS) {
        adsApi.initialize(it.player, it.imaIntegration, it.daiIntegration)
      }
      val layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      it.playerView.layoutParams = layoutParams
      (it.playerView.parent as? ViewGroup)?.removeView(it.playerView)
      addView(it.playerView, 0, layoutParams)

      presentationManager = PresentationManager(
        it,
        reactContext,
        eventEmitter
      )

      eventEmitter.preparePlayer(it.player)
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
