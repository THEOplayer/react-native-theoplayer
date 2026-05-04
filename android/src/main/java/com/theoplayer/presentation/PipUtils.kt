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
private const val ACTION_SKIP_TO_PREV = ACTION_PLAY + 4
private const val ACTION_SKIP_TO_NEXT = ACTION_PLAY + 5
private const val ACTION_IGNORE = ACTION_PLAY + 999
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
    } catch (ignore: IllegalArgumentException) { /*ignore*/
    }
    enabled = false
  }

  fun destroy() {
    disable()
  }

  @RequiresApi(Build.VERSION_CODES.O)
  fun buildPipActions(
    paused: Boolean,
    enablePlayPause: Boolean,
    enableQueueActions: Boolean,
    enableTrickPlay: Boolean
  ): List<RemoteAction> {
    return mutableListOf<RemoteAction>().apply {

      if (enableQueueActions) {
        // Queue controls: Skip to Previous
        add(
          buildRemoteAction(
            ACTION_SKIP_TO_PREV,
            R.drawable.ic_prev,
            R.string.skip_to_previous,
            R.string.skip_to_previous_description
          )
        )
      } else if (enableTrickPlay) {
        // Trick-play: Rewind
        add(
          buildRemoteAction(
            ACTION_RWD,
            R.drawable.ic_rewind,
            R.string.rewind,
            R.string.rewind_description
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
            R.string.play,
            R.string.play_description,
            enablePlayPause
          )
        } else {
          buildRemoteAction(
            ACTION_PAUSE,
            R.drawable.ic_pause,
            R.string.play,
            R.string.pause_description,
            enablePlayPause
          )
        }
      )

      if (enableQueueActions) {
        // Queue controls: Skip to Next
        add(
          buildRemoteAction(
            ACTION_SKIP_TO_NEXT,
            R.drawable.ic_next,
            R.string.skip_to_next,
            R.string.skip_to_previous_description
          )
        )
      } else if (enableTrickPlay) {
        // Trick-play: Fast Forward
        add(
          buildRemoteAction(
            ACTION_FFD,
            R.drawable.ic_fast_forward,
            R.string.fast_forward,
            R.string.fast_forward_description
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
    return view.findViewById<ViewGroup>(com.theoplayer.android.R.id.theo_content_player_container)
      ?.getChildAt(0) // AspectRatioView
      ?.run {
        Rect().apply {
          getGlobalVisibleRect(this)
        }
      }
  }

  @RequiresApi(Build.VERSION_CODES.O)
  fun getPipParams(): PictureInPictureParams {
    val mediaControlProxy = viewCtx.mediaControlProxy
    val visibleRect = getContentViewRect(viewCtx.playerView)

    return PictureInPictureParams.Builder()
      .setSourceRectHint(visibleRect)
      // Must be between 2.39:1 and 1:2.39 (inclusive)
      .setAspectRatio(getSafeAspectRatio(player.videoWidth, player.videoHeight))
      .setActions(
        buildPipActions(
          player.isPaused,
          mediaControlProxy.playPauseEnabled,
          mediaControlProxy.queueActionsEnabled,
          mediaControlProxy.trickPlayEnabled)
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
          viewCtx.mediaControlProxy.apply {
            when (action) {
              ACTION_PLAY -> onPlay()
              ACTION_PAUSE -> onPause()
              ACTION_FFD -> onFastForward()
              ACTION_RWD -> onRewind()
              ACTION_SKIP_TO_NEXT -> onSkipToNext(player)
              ACTION_SKIP_TO_PREV -> onSkipToPrevious(player)
            }
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
    val icon: Icon = Icon.createWithResource(
      reactContext,
      when {
        enabled -> iconId
        // On Android 8-11 devices, if you go to PiP during an IMA ad on Android,
        // the NO_ICON causes a System UI crash.
        Build.VERSION.SDK_INT in Build.VERSION_CODES.O..Build.VERSION_CODES.R ->
          android.R.drawable.screen_background_light_transparent

        else -> NO_ICON
      }
    )
    val title = reactContext.getString(titleId)
    val desc = reactContext.getString(descId)
    return RemoteAction(icon, title, desc, pendingIntent)
  }
}
