package com.reactnativetheoplayer.media

import android.content.Intent
import android.os.Bundle
import android.support.v4.media.MediaBrowserCompat
import android.support.v4.media.session.PlaybackStateCompat
import androidx.media.MediaBrowserServiceCompat
import com.theoplayer.ReactTHEOplayerViewRepository
import com.theoplayer.android.api.source.SourceDescription

private const val BROWSABLE_ROOT = "/"
private const val EMPTY_ROOT = "@empty@"

private const val ALLOWED_PLAYBACK_ACTIONS =
  PlaybackStateCompat.ACTION_PLAY_PAUSE or
  PlaybackStateCompat.ACTION_PLAY or
  PlaybackStateCompat.ACTION_PAUSE or
  PlaybackStateCompat.ACTION_SEEK_TO or
  PlaybackStateCompat.ACTION_FAST_FORWARD or
  PlaybackStateCompat.ACTION_REWIND or
  PlaybackStateCompat.ACTION_SKIP_TO_QUEUE_ITEM or
  PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
  PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS or
  PlaybackStateCompat.ACTION_SET_PLAYBACK_SPEED

class MediaBrowserService: MediaBrowserServiceCompat() {
  val mediaLibrary: MediaLibrary = MediaLibrary()

  override fun onCreate() {
    super.onCreate()

    ReactTHEOplayerViewRepository.getViews().firstOrNull()?.let { view ->
      view.playerContext?.mediaSessionConnector?.let { connector ->

        connector.enabledPlaybackActions = ALLOWED_PLAYBACK_ACTIONS

        // Install the session token from our THEOplayerView's mediasession connector.
        sessionToken = connector.mediaSession.sessionToken

        // Install a queueNavigator to able next/previous items from the MediaLibrary
        connector.queueNavigator = MediaQueueNavigator(mediaLibrary)

        // Install a playbackPreparer to get media items from the MediaLibrary
        connector.playbackPreparer = MediaPlaybackPreparer(mediaLibrary, connector)

      }
    }
  }

  override fun onGetRoot(
    clientPackageName: String,
    clientUid: Int,
    rootHints: Bundle?
  ): BrowserRoot {
    return BrowserRoot(BROWSABLE_ROOT, null)
  }

  override fun onTaskRemoved(rootIntent: Intent?) {
    super.onTaskRemoved(rootIntent)
    stopSelf()
  }

  override fun onLoadChildren(
    parentId: String,
    result: Result<List<MediaBrowserCompat.MediaItem>>
  ) {
    if (parentId == EMPTY_ROOT) {
      result.sendResult(null)
      return
    }
    result.sendResult(mediaLibrary.mediaItems)
  }
}
