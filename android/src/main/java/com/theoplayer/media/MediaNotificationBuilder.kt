package com.theoplayer.media

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE
import androidx.core.content.ContextCompat
import androidx.media.session.MediaButtonReceiver
import com.facebook.common.executors.UiThreadImmediateExecutorService
import com.facebook.common.references.CloseableReference
import com.facebook.datasource.DataSource
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber
import com.facebook.imagepipeline.image.CloseableImage
import com.facebook.imagepipeline.request.ImageRequest
import com.theoplayer.R

private const val TAG = "MediaNotification"

class MediaNotificationBuilder(
  private val context: Context,
  private val notificationManager: NotificationManager,
  private val mediaSession: MediaSessionCompat
) {

  private var channel: NotificationChannel? = null
  private var channelId: String? = null

  init {
    channelId = context.getString(R.string.notification_channel_id)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      channel = NotificationChannel(
        channelId,
        context.getString(R.string.notification_channel_name),
        NotificationManager.IMPORTANCE_DEFAULT
      ).apply {
        setShowBadge(false)
        lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
        setSound(null, null)
        notificationManager.createNotificationChannel(this)
      }
    }
  }

  private val playAction = NotificationCompat.Action(
    R.drawable.ic_play, context.getString(R.string.play),
    MediaButtonReceiver.buildMediaButtonPendingIntent(
      context,
      PlaybackStateCompat.ACTION_PLAY_PAUSE
    )
  )

  private val pauseAction = NotificationCompat.Action(
    R.drawable.ic_pause, context.getString(R.string.pause),
    MediaButtonReceiver.buildMediaButtonPendingIntent(
      context,
      PlaybackStateCompat.ACTION_PLAY_PAUSE
    )
  )

  fun build(
    @PlaybackStateCompat.State playbackState: Int,
    largeIcon: Bitmap?,
    enableMediaControls: Boolean = true,
    enableContentIntent: Boolean = true,
    enableCancelButton: Boolean = true
  ): Notification {
    val builder = channelId.let {
      if (it != null) {
        NotificationCompat.Builder(context, it)
      } else {
        @Suppress("DEPRECATION") NotificationCompat.Builder(context)
      }
    }
    builder.apply {

      // Fix for a bug where ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK that was passed
      // with the startForeground call got ignored.
      foregroundServiceBehavior = FOREGROUND_SERVICE_IMMEDIATE

      // Add the metadata for the currently playing track
      mediaSession.controller.metadata?.description?.let {
        setContentTitle(it.title)
        setContentText(it.subtitle)
        setSubText(it.description)
      }

      // Enable launching the session activity by clicking the notification
      if (enableContentIntent) {
        setContentIntent(mediaSession.controller.sessionActivity)
      }

      // Stop the service when the notification is swiped to dismiss
      setDeleteIntent(
        MediaButtonReceiver.buildMediaButtonPendingIntent(
          context,
          PlaybackStateCompat.ACTION_STOP
        )
      )

      // Notification category: media transport control for playback.
      setCategory(NotificationCompat.CATEGORY_TRANSPORT)

      // The UI may choose to show these items smaller, or at a different position in the
      // list, compared with your app's PRIORITY_DEFAULT items
      priority = NotificationCompat.PRIORITY_DEFAULT

      // Make the transport controls visible on the lockscreen
      setVisibility(NotificationCompat.VISIBILITY_PUBLIC)

      // Add an app icon and set its accent color
      setSmallIcon(R.drawable.ic_notification_small)

      // Set the large icon that is shown in the notification
      setLargeIcon(largeIcon)

      // Be careful when you set the background color. In an ordinary notification in
      // Android version 5.0 or later, the color is applied only to the background of the
      // small app icon. But for MediaStyle notifications prior to Android 7.0, the color is
      // used for the entire notification background. Test your background color. Go gentle
      // on the eyes and avoid extremely bright or fluorescent colors.
      color = ContextCompat.getColor(context, R.color.app_primary_color)

      // Add a play/pause button
      if (enableMediaControls) {
        if (playbackState == PlaybackStateCompat.STATE_PAUSED) {
          addAction(playAction)
        } else if (playbackState == PlaybackStateCompat.STATE_PLAYING) {
          addAction(pauseAction)
        }
      } else {
        // Add empty placeholder action as clearActions() does not work.
        addAction(0, null, null)
      }

      // Take advantage of MediaStyle features
      val style = androidx.media.app.NotificationCompat.MediaStyle()

      // Associate the notification with your session. This allows third-party apps and
      // companion devices to access and control the session.
      style.setMediaSession(mediaSession.sessionToken)

      // Add up to 3 actions to be shown in the notification's standard-sized contentView.
      style.setShowActionsInCompactView(0)

      if (enableCancelButton) {
        // In Android 5.0 (API level 21) and later you can swipe away a notification to
        // stop the player once the service is no longer running in the foreground.
        style.setShowCancelButton(true)
        style.setCancelButtonIntent(
          MediaButtonReceiver.buildMediaButtonPendingIntent(
            context,
            PlaybackStateCompat.ACTION_STOP
          )
        )
      }
      setStyle(style)
    }
    return builder.build()
  }
}

fun fetchImageFromUri(uri: Uri?, block: (Bitmap?) -> Unit) {
  if (uri == null) {
    block(null)
    return
  }

  val imageRequest = ImageRequest.fromUri(uri)
  val imagePipeline = Fresco.getImagePipeline()

  imagePipeline.fetchDecodedImage(imageRequest, null).also {
    it.subscribe(
      object : BaseBitmapDataSubscriber() {
        override fun onNewResultImpl(bitmap: Bitmap?) {
          block(bitmap)
        }

        override fun onFailureImpl(dataSource: DataSource<CloseableReference<CloseableImage>>) {
          if (dataSource.failureCause != null) {
            Log.w(TAG, "Failed to get image $uri")
          }
          block(null)
        }
      },
      UiThreadImmediateExecutorService.getInstance()
    )
  }
}

fun loadPlaceHolderIcon(context: Context, res: Int = R.drawable.ic_notification_large): Bitmap? {
  return try {
    BitmapFactory.decodeResource(context.resources, res)
  } catch(e: Exception) {
    // Make sure we never crash on trying to decode a possibly overridden icon resource.
    Log.w(TAG, "Failed to decode placeHolderIcon: ${e.message}")
    null
  }
}
