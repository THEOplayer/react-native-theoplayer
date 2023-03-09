package com.theoplayer.audio

import android.app.Notification
import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import android.support.v4.media.session.PlaybackStateCompat
import android.util.Log
import androidx.core.app.NotificationCompat
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
import com.theoplayer.android.connector.mediasession.MediaSessionConnector

private const val TAG = "MediaNotification"

class MediaNotificationBuilder(
  private val context: Context,
  private val mediaSessionConnector: MediaSessionConnector
) {

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

  private fun fetchImageFromUri(uri: Uri?, block: (Bitmap?) -> Unit) {
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

  fun build(
    channelId: String,
    isPaused: Boolean = true,
    allowContentIntent: Boolean = true,
    showActions: Boolean = true,
    showCancelButton: Boolean = true
  ): Notification {
    val builder = NotificationCompat.Builder(context, channelId).apply {

      // Add the metadata for the currently playing track
      mediaSessionConnector.getMediaSessionMetadata().description?.let {
        setContentTitle(it.title)
        setContentText(it.subtitle)
        setSubText(it.description)
      }

      // Large icon
      fetchImageFromUri(mediaSessionConnector.mediaSession.controller.metadata?.description?.iconUri) { largeIcon ->
        setLargeIcon(largeIcon)
      }

      // Enable launching the session activity by clicking the notification
      if (allowContentIntent) {
        setContentIntent(mediaSessionConnector.mediaSession.controller.sessionActivity)
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
      priority = NotificationCompat.PRIORITY_LOW

      // Make the transport controls visible on the lockscreen
      setVisibility(NotificationCompat.VISIBILITY_PUBLIC)

      // Add an app icon and set its accent color
      setSmallIcon(R.drawable.ic_notification_small)

      // Be careful when you set the background color. In an ordinary notification in
      // Android version 5.0 or later, the color is applied only to the background of the
      // small app icon. But for MediaStyle notifications prior to Android 7.0, the color is
      // used for the entire notification background. Test your background color. Go gentle
      // on the eyes and avoid extremely bright or fluorescent colors.
      color = ContextCompat.getColor(context, R.color.app_primary_color)

      // Take advantage of MediaStyle features
      val style = androidx.media.app.NotificationCompat.MediaStyle()
        // Associate the notification with your session. This allows third-party apps and
        // companion devices to access and control the session.
        .setMediaSession(mediaSessionConnector.mediaSession.sessionToken)

      if (showActions) {
        // Add up to 3 actions to be shown in the notification's standard-sized contentView.
        style.setShowActionsInCompactView(0)
      }
      if (showCancelButton) {
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

      // Add a play/pause button
      if (isPaused) {
        addAction(playAction)
      } else {
        addAction(pauseAction)
      }
    }
    return builder.build()
  }
}
