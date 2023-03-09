package com.theoplayer.audio

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.os.Binder
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.support.v4.media.MediaBrowserCompat
import android.text.TextUtils
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import androidx.media.MediaBrowserServiceCompat
import androidx.media.session.MediaButtonReceiver
import com.theoplayer.R
import com.theoplayer.ReactTHEOplayerContext
import com.theoplayer.android.api.event.player.PlayEvent
import com.theoplayer.android.api.event.player.PlayerEvent
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.connector.mediasession.event.MediaSessionEvent

private const val BROWSABLE_ROOT = "/"
private const val EMPTY_ROOT = "@empty@"

private const val NOTIFICATION_ID = 1

private const val TAG = "MediaPlaybackService"

class MediaPlaybackService : MediaBrowserServiceCompat() {

  private lateinit var notificationManager: NotificationManager
  private lateinit var notificationBuilder: MediaNotificationBuilder

  private var playerContext: ReactTHEOplayerContext? = null

  private val player: Player?
    get() = playerContext?.player

  inner class MediaPlaybackBinder : Binder() {
    private val service: MediaPlaybackService
      get() = this@MediaPlaybackService
  }

  private val binder: MediaPlaybackBinder by lazy { MediaPlaybackBinder() }

  override fun onCreate() {
    super.onCreate()
    Log.d(TAG, "onCreate")

    notificationManager = (getSystemService(NOTIFICATION_SERVICE) as NotificationManager)

    // Apply existing player context
    if (ReactTHEOplayerContext.instance != null) {
      Log.d(TAG, "onCreate - EXISTING player context")
      connectPlayerContext(ReactTHEOplayerContext.instance!!)
    } else {
      Log.d(TAG, "onCreate - NO existing player context")
    }
  }

  override fun onBind(intent: Intent): IBinder {
    Log.d(TAG, "onBind ${intent.action}")
    return binder
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    Log.d(TAG, "onStartCommand ${intent?.action}")

    playerContext?.mediaSessionIntegration?.mediaSession?.let { mediaSession ->
      Log.d(TAG, "onStartCommand - handle intent - ${intent?.action}")
      MediaButtonReceiver.handleIntent(mediaSession, intent)
    }
    return super.onStartCommand(intent, flags, startId)
  }

  override fun onDestroy() {
    Log.d(TAG, "onDestroy")
    super.onDestroy()
    removeListeners()
  }

  private fun connectPlayerContext(playerContext: ReactTHEOplayerContext) {
    this.playerContext = playerContext

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

    playerContext.mediaSessionIntegration.connector.let {
      notificationBuilder = MediaNotificationBuilder(this@MediaPlaybackService, it)
      it.mediaSession.apply {
        setSessionActivity(sessionActivityPendingIntent)
        setMediaButtonReceiver(mediaButtonPendingIntent)
      }
    }

    addListeners()

    // This ensures that the service starts and continues to run, even when all
    // UI MediaBrowser activities that are bound to it unbind.
    Log.d(TAG, "startService")
    ContextCompat.startForegroundService(
      applicationContext,
      Intent(applicationContext, MediaPlaybackService::class.java)
    )

    updateNotification(false)
  }

  private fun addListeners() {
    player?.apply {
      addEventListener(PlayerEventTypes.SOURCECHANGE, this@MediaPlaybackService::handlePlayerEvent)
      addEventListener(
        PlayerEventTypes.LOADEDMETADATA,
        this@MediaPlaybackService::handlePlayerEvent
      )
      addEventListener(PlayerEventTypes.ENDED, this@MediaPlaybackService::handlePlayerEvent)
      addEventListener(PlayerEventTypes.PAUSE, this@MediaPlaybackService::handlePlayerEvent)
      addEventListener(PlayerEventTypes.PLAY, this@MediaPlaybackService::handlePlayerEvent)
    }

    playerContext?.mediaSessionIntegration?.connector?.apply {
      addEventListener<MediaSessionEvent.StopEvent> {
        // Stop the service
        Log.d(TAG, "stopSelf")
        player?.pause()
        stopForeground(true)
        stopSelf()
      }
    }
  }

  private fun removeListeners() {
    player?.apply {
      removeEventListener(
        PlayerEventTypes.SOURCECHANGE,
        this@MediaPlaybackService::handlePlayerEvent
      )
      removeEventListener(
        PlayerEventTypes.LOADEDMETADATA,
        this@MediaPlaybackService::handlePlayerEvent
      )
      removeEventListener(PlayerEventTypes.ENDED, this@MediaPlaybackService::handlePlayerEvent)
      removeEventListener(PlayerEventTypes.PAUSE, this@MediaPlaybackService::handlePlayerEvent)
      removeEventListener(PlayerEventTypes.PLAY, this@MediaPlaybackService::handlePlayerEvent)
    }

    // TODO: move mediasession listeners
  }

  private fun handlePlayerEvent(event: PlayEvent) {
    updateNotification()
  }

  private fun handlePlayerEvent(event: PlayerEvent<*>) {
    updateNotification()
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
    val isPaused = player?.isPaused == true
    updateNotification(isPaused)
  }

  private fun updateNotification(isPaused: Boolean) {
    Log.d(TAG, "updateNotification")

    val channelId = getString(R.string.notification_channel_id)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        channelId,
        getString(R.string.notification_channel_name),
        NotificationManager.IMPORTANCE_DEFAULT
      ).apply {
        setShowBadge(false)
        lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
        setSound(null, null)
      }
      notificationManager.createNotificationChannel(channel)
    }

    val notification = notificationBuilder.build(channelId, isPaused)

    // When a service is playing, it should be running in the foreground.
    // This lets the system know that the service is performing a useful function and should
    // not be killed if the system is low on memory.
    if (isPaused) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        // Remove this service from foreground state, allowing it to be killed if more memory is
        // needed. This does not stop the service from running (for that you use stopSelf()
        // or related methods), just takes it out of the foreground state.
        stopForeground(STOP_FOREGROUND_DETACH)
        Log.d(TAG, "stopForeground")
      } else {
        @Suppress("DEPRECATION")
        stopForeground(false)
        Log.d(TAG, "stopForeground")
      }
      notificationManager.notify(NOTIFICATION_ID, notification)
    } else {
      // When a service runs in the foreground, it must display a notification, ideally
      // with one or more transport controls. The notification should also include useful
      // information from the session's metadata.
      startForeground(NOTIFICATION_ID, notification)
      Log.d(TAG, "startForeground")
    }
  }
}
