package com.theoplayer.media

import android.app.*
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Binder
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.support.v4.media.MediaBrowserCompat
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import android.text.TextUtils
import android.util.Log
import androidx.core.content.ContextCompat
import androidx.media.MediaBrowserServiceCompat
import androidx.media.session.MediaButtonReceiver
import com.theoplayer.BuildConfig
import com.theoplayer.ReactTHEOplayerContext
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.connector.mediasession.MediaSessionConnector
import com.theoplayer.android.connector.mediasession.MediaSessionListener

private const val BROWSABLE_ROOT = "/"
private const val EMPTY_ROOT = "@empty@"
private const val STOP_SERVICE_IF_APP_REMOVED = true

private const val NOTIFICATION_ID = 1

private const val TAG = "MediaPlaybackService"

class MediaPlaybackService : MediaBrowserServiceCompat() {

  private lateinit var notificationManager: NotificationManager
  private lateinit var notificationBuilder: MediaNotificationBuilder

  private var playerContext: ReactTHEOplayerContext? = null

  private var enableMediaControls: Boolean = true

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

    fun setEnablePlaybackControls(enable: Boolean) {
      enableMediaControls = enable
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
    notificationBuilder = MediaNotificationBuilder(this, notificationManager, mediaSession)

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
      setActive(true)
    }

    // Set the MediaBrowserServiceCompat's media session.
    sessionToken = mediaSession.sessionToken
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

  override fun onGetRoot(
    clientPackageName: String,
    clientUid: Int,
    rootHints: Bundle?
  ): BrowserRoot {
    // (Optional) Control the level of access for the specified package name.
    // You'll need to write your own logic to do this.
    return if (allowBrowsing(clientPackageName, clientUid)) {
      // Returns a root ID that clients can use with onLoadChildren() to retrieve
      // the content hierarchy.
      BrowserRoot(BROWSABLE_ROOT, null)
    } else {
      // Clients can connect, but this BrowserRoot is an empty hierachy
      // so onLoadChildren returns nothing. This disables the ability to browse for content.
      BrowserRoot(EMPTY_ROOT, null)
    }
  }

  private fun allowBrowsing(clientPackageName: String, clientUid: Int): Boolean {
    // Only allow browsing from the same package
    return TextUtils.equals(clientPackageName, packageName)
  }

  override fun onLoadChildren(
    parentId: String,
    result: Result<List<MediaBrowserCompat.MediaItem>>
  ) {
    if (parentId == EMPTY_ROOT) {
      result.sendResult(null)
      return
    }
    result.sendResult(emptyList())
  }

  private fun updateNotification() {
    player?.let {
      if (it.isPaused) {
        updateNotification(PlaybackStateCompat.STATE_PAUSED)
      } else {
        updateNotification(PlaybackStateCompat.STATE_PLAYING)
      }
    }
  }

  private fun updateNotification(@PlaybackStateCompat.State playbackState: Int) {

    // When a service is playing, it should be running in the foreground.
    // This lets the system know that the service is performing a useful function and should
    // not be killed if the system is low on memory.
    when (playbackState) {
      PlaybackStateCompat.STATE_PAUSED -> {
        // Fetch large icon asynchronously
        fetchImageFromUri(mediaSession.controller.metadata?.description?.iconUri) { largeIcon ->
          notificationManager.notify(NOTIFICATION_ID, notificationBuilder.build(playbackState, largeIcon, enableMediaControls))
        }
      }
      PlaybackStateCompat.STATE_PLAYING -> {
        // When a service runs in the foreground, it must display a notification, ideally
        // with one or more transport controls. The notification should also include useful
        // information from the session's metadata.
        // Fetch large icon asynchronously
        fetchImageFromUri(mediaSession.controller.metadata?.description?.iconUri) { largeIcon ->
         try {
           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
             startForeground(
               NOTIFICATION_ID,
               notificationBuilder.build(playbackState, largeIcon, enableMediaControls),
               ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
             )
           } else {
             startForeground(
               NOTIFICATION_ID,
               notificationBuilder.build(playbackState, largeIcon, enableMediaControls)
             )
           }
         } catch (e: IllegalStateException) {
           // Make sure that app does not crash in case anything goes wrong with starting the service.
           // https://issuetracker.google.com/issues/229000935
           Log.w(TAG, "Failed to start foreground service: ${e.message}")
         }
        }
      }
      PlaybackStateCompat.STATE_STOPPED -> {
        // Remove this service from foreground state, allowing it to be killed if more memory is
        // needed. This does not stop the service from running (for that you use stopSelf()
        // or related methods), just takes it out of the foreground state.
        // Also remove the notification.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
          stopForeground(Service.STOP_FOREGROUND_REMOVE)
        } else {
          @Suppress("DEPRECATION")
          stopForeground(true)
        }
      }
      else -> {
        // Ignore
      }
    }
  }
}
