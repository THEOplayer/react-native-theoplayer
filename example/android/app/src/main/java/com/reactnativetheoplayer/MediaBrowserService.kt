package com.reactnativetheoplayer

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.support.v4.media.MediaBrowserCompat
import androidx.media.MediaBrowserServiceCompat
import com.theoplayer.ReactTHEOplayerViewRepository
import com.theoplayer.android.connector.mediasession.PlaybackPreparer

private const val BROWSABLE_ROOT = "/"
private const val EMPTY_ROOT = "@empty@"

class MediaBrowserService: MediaBrowserServiceCompat() {
  val mediaLibrary: MediaLibrary = MediaLibrary()

  override fun onCreate() {
    super.onCreate()

    ReactTHEOplayerViewRepository.getViews().firstOrNull()?.let { view ->
      view.playerContext?.mediaSessionConnector?.let { connector ->

        // Install the session token from our THEOplayerView's mediasession connector.
        sessionToken = connector.mediaSession.sessionToken

        connector.playbackPreparer = object : PlaybackPreparer {

          override fun getSupportedPrepareActions(): Long {
            return PlaybackPreparer.AVAILABLE_ACTIONS
          }

          override fun onPrepare(autoPlay: Boolean) {
            if (autoPlay) {
              connector.player?.play()
            }
          }

          override fun onPrepareFromMediaId(mediaId: String?, autoPlay: Boolean, extras: Bundle?) {
            connector.player?.let { player ->
              player.source = mediaLibrary.sourceFromMediaId(mediaId)
              if (autoPlay) {
                player.play()
              }
            }
          }

          override fun onPrepareFromSearch(query: String?, autoPlay: Boolean, extras: Bundle?) {
          }

          override fun onPrepareFromUri(uri: Uri?, autoPlay: Boolean, extras: Bundle?) {
          }
        }
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
