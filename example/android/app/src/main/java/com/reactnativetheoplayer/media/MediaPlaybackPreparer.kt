package com.reactnativetheoplayer.media

import android.net.Uri
import android.os.Bundle
import com.theoplayer.android.connector.mediasession.MediaSessionConnector
import com.theoplayer.android.connector.mediasession.PlaybackPreparer

class MediaPlaybackPreparer(
  private val mediaLibrary: MediaLibrary,
  private val mediaSessionConnector: MediaSessionConnector
): PlaybackPreparer {

  override fun getSupportedPrepareActions(): Long {
    return PlaybackPreparer.Companion.AVAILABLE_ACTIONS
  }

  override fun onPrepare(autoPlay: Boolean) {
    if (autoPlay) {
      mediaSessionConnector.player?.play()
    }
  }

  override fun onPrepareFromMediaId(mediaId: String?, autoPlay: Boolean, extras: Bundle?) {
    mediaSessionConnector.player?.let { player ->
      player.source = mediaLibrary.setSourceFromMediaId(mediaId)
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
