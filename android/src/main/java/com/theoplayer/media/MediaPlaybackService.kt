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
import com.theoplayer.BuildConfig
import com.theoplayer.ReactTHEOplayerContext
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.connector.mediasession.MediaSessionConnector
import com.theoplayer.android.connector.mediasession.MediaSessionListener

private const val STOP_SERVICE_IF_APP_REMOVED = true

private const val NOTIFICATION_ID = 1

private const val TAG = "MediaPlaybackService"

class MediaPlaybackService : Service() {

  private lateinit var notificationManager: NotificationManager
  private lateinit var notificationBuilder: MediaNotificationBuilder

  private var playerContext: ReactTHEOplayerContext? = null

  private var mediaSessionConfig: MediaSessionConfig = MediaSessionConfig()

  private val player: Player?
    get() = playerContext?.player

  private lateinit var mediaSessionConnector: MediaSessionConnector
  private val mediaSession: MediaSessionCompat
    get() =  mediaSessionConnector.mediaSession

  inner class MediaPlaybackBinder : Binder() {
    private val service: MediaPlaybackService
      get() = this@MediaPlaybackService

    val mediaSessionConnector: MediaSessionConnector
      get() = service.mediaSessionConnector

    fun setPlayerContext(playerContext: ReactTHEOplayerContext) {
      service.connectPlayerContext(playerContext)
    }

    fun setEnablePlaybackControls(newConfig: MediaSessionConfig) {
      mediaSessionConfig = newConfig
      updateNotification()
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
    removeListeners()
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

    // Sets a pending intent for your media button receiver to allow restarting playback after
    // the session has been stopped.
    val mediaButtonPendingIntent = PendingIntent.getBroadcast(
      this@MediaPlaybackService,
      0,
      Intent(
        Intent.ACTION_MEDIA_BUTTON, null, applicationContext, MediaButtonReceiver::class.java
      ),
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        PendingIntent.FLAG_IMMUTABLE
      } else {
        PendingIntent.FLAG_ONE_SHOT
      }
    )

    // Create and initialize the media session
    val mediaSession = MediaSessionCompat(this, TAG).apply {
      setSessionActivity(sessionActivityPendingIntent)
      setMediaButtonReceiver(mediaButtonPendingIntent)
    }

    // Create a MediaSessionConnector.
    mediaSessionConnector = MediaSessionConnector(mediaSession).apply {
      debug = BuildConfig.LOG_MEDIASESSION_EVENTS

      // Set mediaSession active
      setActive(BuildConfig.EXTENSION_MEDIASESSION)
    }
  }

  private fun stopForegroundService() {
    updateNotification(PlaybackStateCompat.STATE_STOPPED)
    stopSelf()
  }

  private fun connectPlayerContext(playerContext: ReactTHEOplayerContext) {
    if (this.playerContext != null) {
      removeListeners()
    }
    this.playerContext = playerContext
    addListeners()
    updateNotification()
  }

  private val mediaSessionListener = object : MediaSessionListener() {
    override fun onStop() {
      stopForegroundService()
    }
  }

  private fun addListeners() {
    mediaSessionConnector.addListener(mediaSessionListener)
  }

  private fun removeListeners() {
    mediaSessionConnector.removeListener(mediaSessionListener)
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
        // Fetch large icon asynchronously
        fetchImageFromMetadata(player?.source) { largeIcon ->
          notificationManager.notify(NOTIFICATION_ID, notificationBuilder.build(playbackState, largeIcon, mediaSessionConfig.mediaSessionEnabled))
        }
      }
      PlaybackStateCompat.STATE_PLAYING -> {
        // When a service runs in the foreground, it must display a notification, ideally
        // with one or more transport controls. The notification should also include useful
        // information from the session's metadata.

        // Get the foreground service started in time before fetching an icon.
        startForegroundWithPlaybackState(playbackState, loadPlaceHolderIcon(this))

        // Fetch the correct large icon asynchronously.
        fetchImageFromMetadata(player?.source) { largeIcon ->
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

  private fun startForegroundWithPlaybackState(@PlaybackStateCompat.State playbackState: Int, largeIcon: Bitmap? = null) {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        startForeground(
          NOTIFICATION_ID,
          notificationBuilder.build(playbackState, largeIcon, mediaSessionConfig.mediaSessionEnabled),
          ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
        )
      } else {
        startForeground(
          NOTIFICATION_ID,
          notificationBuilder.build(playbackState, largeIcon, mediaSessionConfig.mediaSessionEnabled)
        )
      }
    } catch (e: IllegalStateException) {
      // Make sure that app does not crash in case anything goes wrong with starting the service.
      // https://issuetracker.google.com/issues/229000935
      Log.w(TAG, "Failed to start foreground service: ${e.message}")
    }
  }
}
