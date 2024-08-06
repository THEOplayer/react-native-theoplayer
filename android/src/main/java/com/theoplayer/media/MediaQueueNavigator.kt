package com.theoplayer.media

import com.theoplayer.android.api.player.Player
import com.theoplayer.android.connector.mediasession.QueueNavigator

private const val DEFAULT_ACTIVE_ITEM_ID = 0L

class MediaQueueNavigator(private var mediaSessionConfig: MediaSessionConfig): QueueNavigator {
  override fun getActiveQueueItemId(player: Player): Long {
    return DEFAULT_ACTIVE_ITEM_ID
  }

  override fun getSupportedQueueNavigatorActions(player: Player): Long {
    return QueueNavigator.AVAILABLE_ACTIONS
  }

  override fun onSkipToNext(player: Player) {
    // Check if we need to treat a MEDIA_NEXT keycode as a MEDIA_FAST_FORWARD
    if (mediaSessionConfig.convertSkipToSeek) {
      player.currentTime += mediaSessionConfig.skipForwardInterval
    }
  }

  override fun onSkipToPrevious(player: Player) {
    // Check if we need to treat a MEDIA_PREVIOUS keycode as a MEDIA_REWIND
    if (mediaSessionConfig.convertSkipToSeek) {
      player.currentTime -= mediaSessionConfig.skipBackwardInterval
    }
  }

  override fun onSkipToQueueItem(player: Player, id: Long) {
  }
}
