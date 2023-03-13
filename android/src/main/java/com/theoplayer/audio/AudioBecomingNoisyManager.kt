package com.theoplayer.audio

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.media.AudioManager

class AudioBecomingNoisyManager(private val context: Context, onAudioBecomingNoisy: () -> Unit) {

  private class BecomingNoisyReceiver(private val onAudioBecomingNoisy: () -> Unit) : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      if (intent.action == AudioManager.ACTION_AUDIO_BECOMING_NOISY) {
        onAudioBecomingNoisy()
      }
    }
  }

  private val noisyAudioStreamReceiver: BecomingNoisyReceiver = BecomingNoisyReceiver(onAudioBecomingNoisy)
  private val intentFilter = IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY)
  private var registered: Boolean = false

  fun setEnabled(enabled: Boolean) {
    if (enabled && !registered) {
      context.registerReceiver(noisyAudioStreamReceiver, intentFilter)
      registered = true
    } else if (!enabled && registered) {
      context.unregisterReceiver(noisyAudioStreamReceiver)
      registered = false
    }
  }
}
