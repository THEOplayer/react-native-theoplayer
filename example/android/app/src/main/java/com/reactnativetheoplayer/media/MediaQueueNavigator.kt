package com.reactnativetheoplayer.media

import com.theoplayer.android.api.player.Player
import com.theoplayer.android.connector.mediasession.QueueNavigator

class MediaQueueNavigator(private val mediaLibrary: MediaLibrary) : QueueNavigator {

  override fun getActiveQueueItemId(player: Player): Long {
    return mediaLibrary.currentItemId()
  }

  override fun getSupportedQueueNavigatorActions(player: Player): Long {
    return QueueNavigator.Companion.AVAILABLE_ACTIONS
  }

  override fun onSkipToNext(player: Player) {
    player.source = mediaLibrary.nextSource()
  }

  override fun onSkipToPrevious(player: Player) {
    player.source = mediaLibrary.prevSource()
  }

  override fun onSkipToQueueItem(player: Player, id: Long) {
    player.source = mediaLibrary.setSourceFromItemId(id)
  }
}
