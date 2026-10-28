package com.theoplayer.media

import android.app.*
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.Bitmap
import android.os.Binder
import android.os.Build
import android.os.IBinder
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import android.util.Log
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat
import androidx.media.session.MediaButtonReceiver
import com.theoplayer.ReactTHEOplayerContext
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.connector.mediasession.MediaSessionConnector

private const val STOP_SERVICE_IF_APP_REMOVED = true

private const val NOTIFICATION_ID = 1

private const val TAG = "MediaPlaybackService"

class MediaPlaybackService : Service() {

  private lateinit var notificationManager: NotificationManager
  private lateinit var notificationBuilder: MediaNotificationBuilder

  private var playerContext: ReactTHEOplayerContext? = null

  // The artwork is cached per source: the notification is rebuilt on every state or available action
  // change, and fetching it again each time would make the artwork flicker.
  private var largeIconSource: SourceDescription? = null
  private var largeIcon: Bitmap? = null
  private val placeholderIcon: Bitmap? by lazy { loadPlaceHolderIcon(this) }

  private val player: Player?
    get() = playerContext?.player

  private lateinit var mediaSessionConnector: MediaSessionConnector
  private val mediaSession: MediaSessionCompat
    get() = mediaSessionConnector.mediaSession

  inner class MediaPlaybackBinder : Binder() {
    private val service: MediaPlaybackService
      get() = this@MediaPlaybackService

    val mediaSessionConnector: MediaSessionConnector
      get() = service.mediaSessionConnector

    fun setPlayerContext(playerContext: ReactTHEOplayerContext) {
      service.connectPlayerContext(playerContext)
    }

    fun isActivePlayerContext(playerContext: ReactTHEOplayerContext): Boolean {
      return service.isActivePlayerContext(playerContext)
    }

    fun updateNotification() {
      service.updateNotification()
    }

    fun updateNotification(@PlaybackStateCompat.State playbackState: Int) {
      service.updateNotification(playbackState)
    }

    fun stopForegroundService() {
      service.stopForegroundService()
    }
  }

  private val binder: MediaPlaybackBinder by lazy { MediaPlaybackBinder() }

  override fun onCreate() {
    super.onCreate()
    initMediaSession()

    notificationManager = (getSystemService(NOTIFICATION_SERVICE) as NotificationManager)
    notificationBuilder = MediaNotificationBuilder(this, notificationManager, mediaSessionConnector)

    // This ensures that the service starts and continues to run, even when all
    // UI MediaBrowser activities that are bound to it unbind.
    try {
      ContextCompat.startForegroundService(
        applicationContext,
        Intent(applicationContext, MediaPlaybackService::class.java)
      )
    } catch (e: IllegalStateException) {
      // Make sure that app does not crash in case anything goes wrong with starting the service.
      // https://issuetracker.google.com/issues/229000935
      Log.w(TAG, "Failed to start foreground service: ${e.message}")
    }

    // Quickly post a notification and already call startForeground. This has to happen within 5s
    // after creating the service to avoid a ForegroundServiceDidNotStartInTimeException
    updateNotification(PlaybackStateCompat.STATE_PLAYING)
  }

  override fun onBind(intent: Intent): IBinder {
    return binder
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    // This ensures that the correct callbacks to MediaSessionCompat.Callback will be triggered
    // based on the incoming KeyEvent.
    // https://developer.android.com/reference/androidx/media/session/MediaButtonReceiver
    MediaButtonReceiver.handleIntent(mediaSession, intent)
    return super.onStartCommand(intent, flags, startId)
  }

  override fun onTaskRemoved(rootIntent: Intent?) {
    super.onTaskRemoved(rootIntent)
    if (STOP_SERVICE_IF_APP_REMOVED) {
      notificationManager.cancel(NOTIFICATION_ID)
      stopSelf()
    }
  }

  override fun onDestroy() {
    super.onDestroy()
    mediaSessionConnector.destroy()
    playerContext = null
  }

  private fun initMediaSession() {
    // Sets an intent for launching UI for this Session. This can be used as a quick link to
    // an ongoing media screen. The intent should be for an activity that may be started using
    // Activity.startActivity(Intent).
    val intentFlags =
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
    val sessionActivityPendingIntent = packageManager
      ?.getLaunchIntentForPackage(packageName)
      ?.let { sessionIntent ->
        PendingIntent.getActivity(
          this@MediaPlaybackService,
          0,
          sessionIntent,
          intentFlags
        )
      }

    // Create and initialize the media session
    val mediaSession = MediaSessionCompat(this, TAG).apply {
      setSessionActivity(sessionActivityPendingIntent)
    }

    // Create a MediaSessionConnector.
    mediaSessionConnector = MediaSessionConnector(mediaSession)
  }

  private fun stopForegroundService() {
    updateNotification(PlaybackStateCompat.STATE_STOPPED)
    stopSelf()
  }

  private fun connectPlayerContext(playerContext: ReactTHEOplayerContext) {
    this.playerContext = playerContext
    updateNotification()
  }

  private fun isActivePlayerContext(playerContext: ReactTHEOplayerContext): Boolean {
    return this.playerContext === playerContext
  }

  private fun updateNotification() {
    val player = player
    when {
      player?.source == null -> updateNotification(PlaybackStateCompat.STATE_STOPPED)
      !player.isPaused -> updateNotification(PlaybackStateCompat.STATE_PLAYING)
      else -> updateNotification(PlaybackStateCompat.STATE_PAUSED)
    }
  }

  private fun updateNotification(@PlaybackStateCompat.State playbackState: Int) {
    // When a service is playing, it should be running in the foreground.
    // This lets the system know that the service is performing a useful function and should
    // not be killed if the system is low on memory.
    when (playbackState) {
      PlaybackStateCompat.STATE_PAUSED -> {
        withLargeIcon { largeIcon ->
          notificationManager.notify(NOTIFICATION_ID, buildNotification(playbackState, largeIcon))
        }
      }

      PlaybackStateCompat.STATE_PLAYING -> {
        // When a service runs in the foreground, it must display a notification, ideally
        // with one or more transport controls. The notification should also include useful
        // information from the session's metadata.

        // Get the foreground service started in time, with a placeholder icon if the artwork for this
        // source still has to be fetched.
        withLargeIcon(showPlaceholderWhileFetching = true) { largeIcon ->
          startForegroundWithPlaybackState(playbackState, largeIcon)
        }
      }

      PlaybackStateCompat.STATE_STOPPED -> {
        // Remove this service from foreground state, allowing it to be killed if more memory is
        // needed. This does not stop the service from running (for that you use stopSelf()
        // or related methods), just takes it out of the foreground state.
        // Also remove the notification.
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
      }

      else -> {
        // Ignore
      }
    }
  }

  /**
   * Passes the artwork for the current source to [block], fetching it only once per source.
   *
   * When [showPlaceholderWhileFetching] is set, [block] is called synchronously with a placeholder
   * first, so the foreground service can be started in time.
   */
  private fun withLargeIcon(
    showPlaceholderWhileFetching: Boolean = false,
    block: (Bitmap?) -> Unit
  ) {
    val source = player?.source
    if (source != null && source == largeIconSource) {
      block(largeIcon)
      return
    }
    if (showPlaceholderWhileFetching) {
      block(placeholderIcon)
    }
    fetchImageFromMetadata(source) { icon ->
      largeIconSource = source
      largeIcon = icon
      block(icon)
    }
  }

  /**
   * Builds the media notification for the player context that currently owns the media session.
   */
  private fun buildNotification(
    @PlaybackStateCompat.State playbackState: Int,
    largeIcon: Bitmap? = null
  ): Notification {
    return notificationBuilder.build(playbackState, largeIcon, playerContext?.mediaControlProxy)
  }

  private fun startForegroundWithPlaybackState(
    @PlaybackStateCompat.State playbackState: Int,
    largeIcon: Bitmap? = null
  ) {
    try {
      ServiceCompat.startForeground(
        this,
        NOTIFICATION_ID,
        buildNotification(playbackState, largeIcon),
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q)
          ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
        else 0
      )
    } catch (e: IllegalStateException) {
      // Make sure that app does not crash in case anything goes wrong with starting the service.
      // https://issuetracker.google.com/issues/229000935
      Log.w(TAG, "Failed to start foreground service: ${e.message}")
    }
  }
}
