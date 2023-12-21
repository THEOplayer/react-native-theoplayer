package com.theoplayer.presentation

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.app.PictureInPictureParams
import android.app.RemoteAction
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Rect
import android.graphics.drawable.Icon
import android.os.Build
import android.util.Rational
import android.view.SurfaceView
import android.view.TextureView
import android.view.View
import android.view.ViewGroup
import androidx.annotation.RequiresApi
import com.facebook.react.uimanager.ThemedReactContext
import com.theoplayer.BuildConfig
import com.theoplayer.R
import com.theoplayer.ReactTHEOplayerContext
import com.theoplayer.android.api.ads.ima.GoogleImaAdEvent
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.player.PlayerEvent
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.player.Player

private const val EXTRA_ACTION = "EXTRA_ACTION"
private const val ACTION_MEDIA_CONTROL = "pip_media_control"
private const val ACTION_PLAY = 0
private const val ACTION_PAUSE = ACTION_PLAY + 1
private const val ACTION_RWD = ACTION_PLAY + 2
private const val ACTION_FFD = ACTION_PLAY + 3
private const val ACTION_IGNORE = ACTION_PLAY + 999
private const val SKIP_TIME = 15
private const val NO_ICON = -1

private val PIP_ASPECT_RATIO_DEFAULT = Rational(16, 9)
private val PIP_ASPECT_RATIO_MIN = Rational(100, 239)
private val PIP_ASPECT_RATIO_MAX = Rational(239, 100)

class PipUtils(
  private val viewCtx: ReactTHEOplayerContext,
  private val reactContext: ThemedReactContext
) {

  private var enabled: Boolean = false
  private var onPlayerAction: EventListener<PlayerEvent<*>>
  private var onAdAction: EventListener<GoogleImaAdEvent>
  private val playerEvents = listOf(PlayerEventTypes.PLAY, PlayerEventTypes.PAUSE)
  private var adEvents = listOf<GoogleImaAdEventType>()
  private val broadcastReceiver: BroadcastReceiver = buildBroadcastReceiver()

  private val player: Player
    get() = viewCtx.player

  init {
    onPlayerAction = EventListener {
      updatePipParams()
    }
    onAdAction = EventListener {
      updatePipParams()
    }
    if (BuildConfig.EXTENSION_GOOGLE_IMA) {
      adEvents = listOf(GoogleImaAdEventType.STARTED, GoogleImaAdEventType.CONTENT_RESUME_REQUESTED)
    }
  }

  @SuppressLint("UnspecifiedRegisterReceiverFlag")
  fun enable() {
    if (enabled) {
      return
    }
    playerEvents.forEach { action ->
      player.addEventListener(action, onPlayerAction)
    }
    adEvents.forEach { action ->
      player.ads.addEventListener(action, onAdAction)
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      reactContext.currentActivity?.registerReceiver(
        broadcastReceiver,
        IntentFilter(ACTION_MEDIA_CONTROL), Context.RECEIVER_EXPORTED
      )
    } else {
      reactContext.currentActivity?.registerReceiver(
        broadcastReceiver,
        IntentFilter(ACTION_MEDIA_CONTROL)
      )
    }

    enabled = true
  }

  fun disable() {
    if (!enabled) {
      return
    }
    playerEvents.forEach { action ->
      player.removeEventListener(action, onPlayerAction)
    }
    adEvents.forEach { action ->
      player.ads.removeEventListener(action, onAdAction)
    }
    try {
      reactContext.currentActivity?.unregisterReceiver(broadcastReceiver)
    } catch (ignore: IllegalArgumentException) { /*ignore*/}
    enabled = false
  }

  fun destroy() {
    disable()
  }

  @RequiresApi(Build.VERSION_CODES.O)
  fun buildPipActions(
    paused: Boolean,
    enablePlayPause: Boolean,
    enableTrickPlay: Boolean
  ): List<RemoteAction> {
    return mutableListOf<RemoteAction>().apply {

      // Trick-play: Rewind
      if (enableTrickPlay) {
        add(
          buildRemoteAction(
            ACTION_RWD,
            R.drawable.ic_rewind,
            R.string.rwd_pip,
            R.string.rwd_desc_pip
          )
        )
      }

      // Play/pause
      // Always add this button, but send an ACTION_IGNORE and make invisible if disabled.
      // If no RemoteActions are added, MediaSession takes over the UI.
      add(
        if (paused) {
          buildRemoteAction(
            ACTION_PLAY,
            R.drawable.ic_play,
            R.string.play_pip,
            R.string.play_desc_pip,
            enablePlayPause
          )
        } else {
          buildRemoteAction(
            ACTION_PAUSE,
            R.drawable.ic_pause,
            R.string.pause_pip,
            R.string.pause_desc_pip,
            enablePlayPause
          )
        }
      )

      // Trick-play: Fast Forward
      if (enableTrickPlay) {
        add(
          buildRemoteAction(
            ACTION_FFD,
            R.drawable.ic_fast_forward,
            R.string.ffd_pip,
            R.string.ffd_desc_pip
          )
        )
      }
    }
  }

  private fun getSafeAspectRatio(width: Int, height: Int): Rational {
    val aspectRatio = Rational(width, height)
    if (aspectRatio.isNaN || aspectRatio.isInfinite || aspectRatio.isZero) {
      // Default aspect ratio
      return PIP_ASPECT_RATIO_DEFAULT
    }
    if (aspectRatio > PIP_ASPECT_RATIO_MAX) {
      return PIP_ASPECT_RATIO_MAX
    }
    if (aspectRatio < PIP_ASPECT_RATIO_MIN) {
      return PIP_ASPECT_RATIO_MIN
    }
    return aspectRatio
  }

  private fun getContentViewRect(view: ViewGroup): Rect? {
    for (i in 0 until view.childCount) {
      val child: View = view.getChildAt(i)
      if (child is ViewGroup) {
        return getContentViewRect(child)
      } else if (child as? SurfaceView != null || child as? TextureView != null) {
        val visibleRect = Rect()
        child.getGlobalVisibleRect(visibleRect)
        return visibleRect
      }
    }
    return null
  }

  @RequiresApi(Build.VERSION_CODES.O)
  fun getPipParams(): PictureInPictureParams {
    val view = viewCtx.playerView
    val player = view.player
    val visibleRect = getContentViewRect(view)
    val isAd = player.ads.isPlaying
    val isLive = player.duration.isInfinite()
    val enablePlayPause = !isAd
    val enableTrickPlay = !isAd && !isLive

    return PictureInPictureParams.Builder()
      .setSourceRectHint(visibleRect)
      // Must be between 2.39:1 and 1:2.39 (inclusive)
      .setAspectRatio(getSafeAspectRatio(view.player.videoWidth, view.player.videoHeight))
      .setActions(
        buildPipActions(player.isPaused, enablePlayPause, enableTrickPlay)
      )
      .build()
  }

  private fun updatePipParams() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      reactContext.currentActivity?.setPictureInPictureParams(getPipParams())
    }
  }

  private fun buildBroadcastReceiver(): BroadcastReceiver {
    return object : BroadcastReceiver() {
      @RequiresApi(Build.VERSION_CODES.O)
      override fun onReceive(context: Context?, intent: Intent?) {
        intent?.getIntExtra(EXTRA_ACTION, -1)?.let { action ->
          when (action) {
            ACTION_PLAY -> player.play()
            ACTION_PAUSE -> player.pause()
            ACTION_FFD -> player.currentTime += SKIP_TIME
            ACTION_RWD -> player.currentTime -= SKIP_TIME
          }
          reactContext.currentActivity?.setPictureInPictureParams(getPipParams())
        }
      }
    }
  }

  @RequiresApi(Build.VERSION_CODES.O)
  private fun buildRemoteAction(
    requestId: Int,
    iconId: Int,
    titleId: Int,
    descId: Int,
    enabled: Boolean = true
  ): RemoteAction {
    // Ignore the action if it is disabled
    val requestCode = if (enabled) requestId else ACTION_IGNORE
    val intent = Intent(ACTION_MEDIA_CONTROL).putExtra(EXTRA_ACTION, requestCode)
    val pendingIntent =
      PendingIntent.getBroadcast(reactContext, requestCode, intent, PendingIntent.FLAG_IMMUTABLE)
    val icon: Icon = Icon.createWithResource(reactContext, if (enabled) iconId else NO_ICON)
    val title = reactContext.getString(titleId)
    val desc = reactContext.getString(descId)
    return RemoteAction(icon, title, desc, pendingIntent)
  }
}
