package com.theoplayer.mediasession

import android.content.Context
import com.theoplayer.android.api.player.Player
import android.support.v4.media.session.MediaSessionCompat
import com.theoplayer.android.mediasession.MediaSessionConnector
import com.theoplayer.BuildConfig

const val TAG = "MediaSessionConnector"

class MediaSessionIntegration(context: Context, player: Player) {
  private val mediaSession: MediaSessionCompat
  private val mediaSessionConnector: MediaSessionConnector

  init {
    // Create and initialize the media session
    mediaSession = MediaSessionCompat(context, TAG)

    // Do not let MediaButtons restart the player when the app is not visible
    mediaSession.setMediaButtonReceiver(null)

    // Create a MediaSessionConnector and attach the THEOplayer instance.
    mediaSessionConnector = MediaSessionConnector(mediaSession)
    mediaSessionConnector.debug = BuildConfig.LOG_MEDIASESSION_EVENTS
    mediaSessionConnector.player = player

    // Set mediaSession active
    mediaSessionConnector.setActive(true)
  }

  fun onResume() {
    mediaSessionConnector.setActive(true)
  }

  fun onPause() {
    mediaSessionConnector.setActive(false)
  }

  fun onDestroy() {
    mediaSessionConnector.destroy()
  }
}
