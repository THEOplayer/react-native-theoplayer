package com.theoplayer.mediasession

import android.content.Context
import com.theoplayer.android.api.player.Player
import android.support.v4.media.session.MediaSessionCompat
import com.theoplayer.BuildConfig
import com.theoplayer.android.connector.mediasession.MediaSessionConnector

const val TAG = "MediaSessionIntegration"

class MediaSessionIntegration(context: Context, player: Player) {
  val mediaSession: MediaSessionCompat
  val connector: MediaSessionConnector

  init {
    // Create and initialize the media session
    mediaSession = MediaSessionCompat(context, TAG)

    // Do not let MediaButtons restart the player when the app is not visible
    mediaSession.setMediaButtonReceiver(null)

    // Create a MediaSessionConnector and attach the THEOplayer instance.
    connector = MediaSessionConnector(mediaSession)
    connector.debug = BuildConfig.LOG_MEDIASESSION_EVENTS
    connector.player = player
    connector.playbackPreparer

    // Set mediaSession active
    connector.setActive(true)
  }

  fun onResume() {
    connector.setActive(true)
  }

  fun onPause() {
    connector.setActive(false)
  }

  fun onDestroy() {
    connector.destroy()
  }
}
