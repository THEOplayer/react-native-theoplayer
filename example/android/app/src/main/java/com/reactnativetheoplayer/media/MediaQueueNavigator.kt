package com.reactnativetheoplayer.media

import android.util.Log
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.connector.mediasession.QueueNavigator

private val TAG = "MediaQueueNavigator"

class MediaQueueNavigator(private val mediaLibrary: MediaLibrary) : QueueNavigator {

  override fun getActiveQueueItemId(player: Player): Long {
    Log.d(TAG, "getActiveQueueItemId: ${mediaLibrary.currentItemId()}")
    return mediaLibrary.currentItemId()
  }

  override fun getSupportedQueueNavigatorActions(player: Player): Long {
    return QueueNavigator.Companion.AVAILABLE_ACTIONS
  }

  override fun onSkipToNext(player: Player) {
    Log.d(TAG, "onSkipToNext")
    player.source = mediaLibrary.nextSource()
  }

  override fun onSkipToPrevious(player: Player) {
    Log.d(TAG, "onSkipToPrevious")
    player.source = mediaLibrary.prevSource()
  }

  override fun onSkipToQueueItem(player: Player, id: Long) {
    Log.d(TAG, "onSkipToQueueItem $id")
    player.source = mediaLibrary.setSourceFromItemId(id)
  }
}
