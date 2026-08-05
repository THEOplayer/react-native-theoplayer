package com.theoplayer.media

import android.support.v4.media.session.PlaybackStateCompat
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.ads.AdEvent
import com.theoplayer.android.api.event.ads.AdsEventTypes
import com.theoplayer.android.api.event.player.PlayerEvent
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.timerange.TimeRanges
import com.theoplayer.android.connector.mediasession.MediaSessionConnector
import com.theoplayer.android.connector.mediasession.PlaybackCallback
import com.theoplayer.android.connector.mediasession.QueueNavigator

typealias MediaControlHandler = () -> Unit

/**
 * Notified whenever the set of media control actions the [MediaControlProxy] currently accepts changes.
 */
fun interface AvailableActionsListener {
  fun onAvailableActionsChanged()
}

/**
 * A media control action that can be presented next to the play/pause action.
 */
enum class MediaControlSlot {
  SKIP_TO_PREVIOUS,
  SKIP_TO_NEXT,
  REWIND,
  FAST_FORWARD
}

/**
 * The media control actions that are currently available, in display order: an optional queue or
 * trick-play action, the play/pause action and another optional queue or trick-play action.
 *
 * Consumers presenting their own media controls, such as the media notification and the PiP window,
 * render these with their own action types instead of deciding themselves which actions apply.
 */
data class MediaControlSlots(
  val leading: MediaControlSlot?,
  val playPauseEnabled: Boolean,
  val trailing: MediaControlSlot?
)

private const val DEFAULT_ACTIVE_ITEM_ID = 0L

private const val AVAILABLE_QUEUE_ACTIONS = (PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
  PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS)

/**
 * MediaControlProxy serves as a proxy for media control actions sent by the MediaSession. It allows
 * external code to register handlers for specific media control actions, which will be invoked when the
 * corresponding action is received from the MediaSession. If no handler is registered for a given action,
 * the proxy will fall back to default behavior (e.g. calling player.play() for a PLAY action).
 */
class MediaControlProxy : PlaybackCallback, QueueNavigator {

  private var player: Player? = null
  private var connector: MediaSessionConnector? = null
  private var serviceBinder: MediaPlaybackService.MediaPlaybackBinder? = null
  private var config: MediaSessionConfig = MediaSessionConfig()
  private val handlers: MutableMap<MediaControlAction, MediaControlHandler> = mutableMapOf()
  private val availableActionsListeners: MutableList<AvailableActionsListener> = mutableListOf()

  // The availability of the playback actions changes when switching between content and ads, or when the
  // stream turns out to be live.
  private val onPlayerAction = EventListener<PlayerEvent<*>> { invalidateAvailableActions() }
  private val onAdAction = EventListener<AdEvent<*>> { invalidateAvailableActions() }
  private val playerEvents = listOf(PlayerEventTypes.LOADEDMETADATA)

  // Use the integration-agnostic ad break events, so client-side (IMA), server-side (SSAI, THEOads) and
  // custom ad integrations are all covered.
  private val adEvents = listOf(AdsEventTypes.AD_BREAK_BEGIN, AdsEventTypes.AD_BREAK_END)

  /**
   * Sets the player whose state determines which actions are currently available. The proxy listens for
   * the events that change that availability, independently of the media session it is attached to.
   */
  fun setPlayer(player: Player?) {
    this.player?.let { current ->
      playerEvents.forEach { current.removeEventListener(it, onPlayerAction) }
      adEvents.forEach { current.ads.removeEventListener(it, onAdAction) }
    }
    this.player = player
    player?.let { current ->
      playerEvents.forEach { current.addEventListener(it, onPlayerAction) }
      adEvents.forEach { current.ads.addEventListener(it, onAdAction) }
    }
    invalidateAvailableActions()
  }

  /**
   * Routes the media session's playback and queue actions through this proxy.
   */
  fun attach(
    connector: MediaSessionConnector,
    serviceBinder: MediaPlaybackService.MediaPlaybackBinder?,
    config: MediaSessionConfig
  ) {
    // Stop routing actions through any previously attached media session.
    detach()

    this.connector = connector
    this.serviceBinder = serviceBinder
    this.config = config

    connector.apply {
      queueNavigator = this@MediaControlProxy
      // All playback actions are routed through this proxy
      playbackCallback = this@MediaControlProxy
    }

    applyConfig()
  }

  /**
   * Sets the media session configuration, which decides whether media controls are enabled at all and
   * how the proxy handles the actions it accepts. The proxy needs it even while there is no media
   * session to attach to, as it also drives the PiP controls.
   */
  fun setConfig(config: MediaSessionConfig) {
    this.config = config
    applyConfig()
  }

  private fun applyConfig() {
    connector?.apply {
      skipForwardInterval = config.skipForwardInterval
      skipBackwardsInterval = config.skipBackwardInterval
    }
    invalidateAvailableActions()
  }

  private fun detach() {
    connector?.apply {
      queueNavigator = null
      playbackCallback = null
    }
    connector = null
    serviceBinder = null
  }

  fun destroy() {
    detach()
    setPlayer(null)
    availableActionsListeners.clear()
  }

  /**
   * Adds a listener that is notified whenever the set of available actions changes, for consumers that
   * present their own media controls, such as the PiP window.
   */
  fun addAvailableActionsListener(listener: AvailableActionsListener) {
    availableActionsListeners.add(listener)
  }

  fun removeAvailableActionsListener(listener: AvailableActionsListener) {
    availableActionsListeners.remove(listener)
  }

  /**
   * The playback actions the MediaSession should advertise, based on the actions the proxy currently
   * accepts. Queue actions are not included here: those are reported through [QueueNavigator].
   */
  private val enabledPlaybackActions: Long
    get() {
      var actions = PlaybackStateCompat.ACTION_STOP or PlaybackStateCompat.ACTION_SET_PLAYBACK_SPEED
      if (playPauseEnabled) {
        actions = actions or PlaybackStateCompat.ACTION_PLAY_PAUSE or
          PlaybackStateCompat.ACTION_PLAY or
          PlaybackStateCompat.ACTION_PAUSE
      }
      if (trickPlayEnabled) {
        actions = actions or PlaybackStateCompat.ACTION_SEEK_TO or
          PlaybackStateCompat.ACTION_FAST_FORWARD or
          PlaybackStateCompat.ACTION_REWIND
      }
      return actions
    }

  /**
   * Reports the currently available actions to the MediaSession, the media notification and any
   * registered [AvailableActionsListener].
   */
  private fun invalidateAvailableActions() {
    connector?.apply {
      enabledPlaybackActions = this@MediaControlProxy.enabledPlaybackActions
      invalidatePlaybackState()
    }
    serviceBinder?.updateNotification()
    availableActionsListeners.forEach { it.onAvailableActionsChanged() }
  }

  fun setHandler(action: MediaControlAction, handler: MediaControlHandler) {
    handlers[action] = handler

    // Make sure the MediaSession and notification know about the updated set of supported actions.
    invalidateAvailableActions()
  }

  fun removeHandler(action: MediaControlAction) {
    handlers.remove(action)

    // Make sure the MediaSession and notification know about the updated set of supported actions.
    invalidateAvailableActions()
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

  /**
   * Whether media controls should be presented at all for this player.
   */
  val mediaControlsEnabled: Boolean
    get() = config.mediaSessionEnabled

  val queueActionsEnabled: Boolean
    get() = hasHandler(MediaControlAction.SKIP_TO_NEXT) ||
      hasHandler(MediaControlAction.SKIP_TO_PREVIOUS) || config.convertSkipToSeek

  val trickPlayEnabled: Boolean
    get() = !isInAd && !isLive

  val playPauseEnabled: Boolean
    get() = !isInAd && (!isLive || config.allowLivePlayPause)

  /**
   * The media controls that are currently available, for consumers that present their own controls.
   * Queue actions take precedence over the trick-play actions.
   */
  val controlSlots: MediaControlSlots
    get() = MediaControlSlots(
      leading = when {
        queueActionsEnabled -> MediaControlSlot.SKIP_TO_PREVIOUS
        trickPlayEnabled -> MediaControlSlot.REWIND
        else -> null
      },
      playPauseEnabled = playPauseEnabled,
      trailing = when {
        queueActionsEnabled -> MediaControlSlot.SKIP_TO_NEXT
        trickPlayEnabled -> MediaControlSlot.FAST_FORWARD
        else -> null
      }
    )

  override fun onPlay() {
    // Make sure the session is currently active and ready to receive commands, but only if enabled.
    if (mediaControlsEnabled) {
      connector?.setActive(true)
    }

    // Don't allow play actions during ads, or on live streams if not configured to allow it.
    if (!playPauseEnabled) return

    // Check if an external handler is registered for the PLAY keycode, and invoke it if so
    if (invokeHandler(MediaControlAction.PLAY)) return

    player?.play()

    // Optionally seek to live, if configured.
    if (config.seekToLiveOnResume && isLive) {
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
    val player = this.player ?: return

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

  private val isLive: Boolean
    get() = player?.duration?.isInfinite() == true

  private val isInAd: Boolean
    get() = player?.ads?.isPlaying == true

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
    if (config.convertSkipToSeek) {
      player.currentTime -= config.skipBackwardInterval
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
    if (config.convertSkipToSeek) {
      player.currentTime += config.skipForwardInterval
    }
  }
}
