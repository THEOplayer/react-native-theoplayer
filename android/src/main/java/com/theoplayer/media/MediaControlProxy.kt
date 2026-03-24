package com.theoplayer.media

import android.support.v4.media.session.PlaybackStateCompat
import com.facebook.react.module.annotations.ReactModule
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.timerange.TimeRanges
import com.theoplayer.android.connector.mediasession.MediaSessionConnector
import com.theoplayer.android.connector.mediasession.PlaybackCallback
import com.theoplayer.android.connector.mediasession.QueueNavigator

typealias MediaControlHandler = () -> Unit

private const val DEFAULT_ACTIVE_ITEM_ID = 0L

const val AVAILABLE_QUEUE_ACTIONS = (PlaybackStateCompat.ACTION_SKIP_TO_QUEUE_ITEM or
  PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
  PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS)

/**
 * MediaControlProxy serves as a proxy for media control actions sent by the MediaSession. It allows
 * external code to register handlers for specific media control actions, which will be invoked when the
 * corresponding action is received from the MediaSession. If no handler is registered for a given action,
 * the proxy will fall back to default behavior (e.g. calling player.play() for a PLAY action).
 */
@Suppress("unused")
@ReactModule(name = MediaControlModule.NAME)
class MediaControlProxy : PlaybackCallback, QueueNavigator {

  private var player: Player? = null
  private var connector: MediaSessionConnector? = null
  private var serviceBinder: MediaPlaybackService.MediaPlaybackBinder? = null
  private var config: MediaSessionConfig? = null
  private val handlers: MutableMap<MediaControlAction, MediaControlHandler> = mutableMapOf()

  fun attach(
    player: Player?,
    connector: MediaSessionConnector,
    serviceBinder: MediaPlaybackService.MediaPlaybackBinder?,
    config: MediaSessionConfig
  ) {
    this.player = player
    this.connector = connector
    this.serviceBinder = serviceBinder
    this.config = config

    connector.apply {
      skipForwardInterval = config.skipForwardInterval
      skipBackwardsInterval = config.skipBackwardInterval
      queueNavigator = this@MediaControlProxy
      // All playback actions are routed through this proxy
      playbackCallback = this@MediaControlProxy
      invalidatePlaybackState()
    }
  }

  fun detach() {
    connector?.apply {
      queueNavigator = null
      playbackCallback = null
    }
  }

  fun setHandler(action: MediaControlAction, handler: MediaControlHandler) {
    handlers[action] = handler

    // Make sure the MediaSession known about the updated set of supported actions.
    connector?.invalidatePlaybackState()
  }

  fun invokeHandler(action: MediaControlAction): Boolean {
    if (!handlers.containsKey(action)) {
      return false
    }
    handlers[action]?.invoke()
    return true
  }

  fun hasHandler(action: MediaControlAction): Boolean {
    return handlers.containsKey(action)
  }

  val queueActionsEnabled: Boolean
    get() = hasHandler(MediaControlAction.SKIP_TO_NEXT) ||
      hasHandler(MediaControlAction.SKIP_TO_PREVIOUS) || config?.convertSkipToSeek == true

  val trickPlayEnabled: Boolean
    get() = !isInAd() && !isLive()

  val playPauseEnabled: Boolean
    get() = !isInAd() && (!isLive() || config?.allowLivePlayPause == true)

  override fun onPlay() {
    // Make sure the session is currently active and ready to receive commands.
    connector?.setActive(true)

    // Don't allow play actions during ads, or on live streams if not configured to allow it.
    if (!playPauseEnabled) return

    // Check if an external handler is registered for the PLAY keycode, and invoke it if so
    if (invokeHandler(MediaControlAction.PLAY)) return

    player?.play()

    // Optionally seek to live, if configured.
    if (config?.seekToLiveOnResume == true && isLive()) {
      player?.currentTime = Double.POSITIVE_INFINITY
    }
  }

  override fun onPause() {
    // Don't allow pause actions during ads, or on live streams if not configured to allow it.
    if (!playPauseEnabled) return

    // Check if an external handler is registered for the PAUSE keycode, and invoke it if so
    if (invokeHandler(MediaControlAction.PAUSE)) return

    player?.pause()
  }

  override fun onStop() {
    serviceBinder?.stopForegroundService()
  }

  override fun onFastForward() {
    // Don't allow skip actions during ads, or on live streams.
    if (!trickPlayEnabled) return

    skip(connector?.skipForwardInterval ?: 0.0)
  }

  override fun onRewind() {
    // Don't allow skip actions during ads, or on live streams.
    if (!trickPlayEnabled) return

    skip(-(connector?.skipBackwardsInterval ?: 0.0))
  }

  override fun onSetPlaybackSpeed(speed: Float) {
    player?.playbackRate = speed.toDouble()
  }

  override fun onSeekTo(positionMs: Long) {
    // Don't allow seek actions during ads, or on live streams.
    if (!trickPlayEnabled) return

    player?.currentTime = 1e-03 * positionMs
  }

  private fun skip(skipTime: Double) {
    val player = connector?.player ?: return

    val currentTime: Double = player.currentTime
    val seekable: TimeRanges = player.seekable
    if (java.lang.Double.isNaN(currentTime) || seekable.length() == 0) {
      return
    }
    for (i in 0 until seekable.length()) {
      if (seekable.getStart(i) <= currentTime && seekable.getEnd(i) >= currentTime) {
        player.currentTime = seekable.getEnd(i)
          .coerceAtMost(seekable.getStart(i).coerceAtLeast(currentTime + skipTime))
      }
    }
  }

  private fun isLive(): Boolean {
    return player?.duration?.isInfinite() == true
  }

  private fun isInAd(): Boolean {
    return player?.ads?.isPlaying == true
  }

  override fun getSupportedQueueNavigatorActions(player: Player): Long {
    return if (queueActionsEnabled) {
      AVAILABLE_QUEUE_ACTIONS
    } else {
      0L
    }
  }

  override fun getActiveQueueItemId(player: Player): Long {
    return DEFAULT_ACTIVE_ITEM_ID
  }

  override fun onSkipToPrevious(player: Player) {
    // Check if an external handler is registered for the MEDIA_NEXT keycode, and invoke it if so
    if (invokeHandler(MediaControlAction.SKIP_TO_PREVIOUS)) return

    // Check if we need to treat a MEDIA_PREVIOUS keycode as a MEDIA_REWIND
    if (config?.convertSkipToSeek == true) {
      player.currentTime -= config?.skipBackwardInterval ?: 0.0
    }
  }

  override fun onSkipToQueueItem(
    player: Player,
    id: Long
  ) {
    // Unsupported action
  }

  override fun onSkipToNext(player: Player) {
    // Check if an external handler is registered for the MEDIA_NEXT keycode, and invoke it if so
    if (invokeHandler(MediaControlAction.SKIP_TO_NEXT)) return

    // Otherwise default logic: Check if we need to treat a MEDIA_NEXT keycode as a MEDIA_FAST_FORWARD
    if (config?.convertSkipToSeek == true) {
      player.currentTime += config?.skipForwardInterval ?: 0.0
    }
  }
}
