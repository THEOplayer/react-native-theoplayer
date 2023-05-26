package com.theoplayer.media

import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.media.session.MediaButtonReceiver

private const val TAG = "MediaButtonReceiver"

class CustomMediaButtonReceiver : MediaButtonReceiver() {

  override fun onReceive(context: Context?, intent: Intent?) {
    // MediaButtonReceiver will throw an IllegalStateException in case there are
    // none, or more than one MediaBrowserServiceCompat instances registered.
    // Handle and ignore the exception here.
    try {
      super.onReceive(context, intent)
    } catch (e: IllegalStateException) {
      Log.e(
        TAG,
        e.message ?: "Failed to handle media playback button action."
      )
    }
  }
}
