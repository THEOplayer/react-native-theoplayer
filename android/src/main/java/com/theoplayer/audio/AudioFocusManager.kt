package com.theoplayer.audio

import android.app.UiModeManager
import android.content.Context
import android.content.res.Configuration
import android.media.AudioManager
import android.util.Log
import androidx.media.AudioAttributesCompat
import androidx.media.AudioFocusRequestCompat
import androidx.media.AudioManagerCompat
import com.theoplayer.BuildConfig
import com.theoplayer.android.api.player.Player

private const val TAG = "AudioFocusManager"

/**
 * Manages audio focus for the application, ensuring proper handling of audio focus changes
 * to control media playback behavior.
 *
 * @param context The context used to access system services.
 * @param player The media player instance associated with this audio focus manager. It can be
 *               provided optionally to control playback behavior.
 */
class AudioFocusManager(
  context: Context,
  private val player: Player? = null
) : AudioManager.OnAudioFocusChangeListener {

  private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
  private val uiModeManager = context.getSystemService(Context.UI_MODE_SERVICE) as? UiModeManager
  private var resumeOnFocusGain = false
  private val focusLock = Any()

  private val audioFocusRequest = AudioFocusRequestCompat.Builder(AudioManagerCompat.AUDIOFOCUS_GAIN)
    .setAudioAttributes(
      AudioAttributesCompat.Builder()
        // Usage value to use when the usage is media, such as music, or movie soundtracks.
        .setUsage(AudioAttributesCompat.USAGE_MEDIA)
        // Content type value to use when the content type is a soundtrack, typically accompanying
        // a movie or TV program.
        .setContentType(AudioAttributesCompat.CONTENT_TYPE_MOVIE)
        .build()
    )
    .setOnAudioFocusChangeListener(this)
    .setWillPauseWhenDucked(true)
    .build()

  /**
   * Called on the listener to notify it the audio focus for this listener has been changed.
   */
  override fun onAudioFocusChange(focusChange: Int) {
    if (uiModeManager?.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION) {
      // Ignore changes in audioFocus for Connected TVs.
      return
    }
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "onAudioFocusChange: ${fromAudioFocusChange(focusChange)}")
    }
    when (focusChange) {
      // Used to indicate a gain of audio focus, or a request of audio focus, of unknown duration.
      AudioManager.AUDIOFOCUS_GAIN -> {
        if (resumeOnFocusGain) {
          synchronized(focusLock) {
            // Reset resume flag
            resumeOnFocusGain = false
          }
          player?.play()
        }
      }

      // Used to indicate a loss of audio focus of unknown duration.
      AudioManager.AUDIOFOCUS_LOSS -> {
        synchronized (focusLock) {
          // This is not a transient loss, we shouldn't automatically resume for now
          resumeOnFocusGain = false;
        }
      }

      // Used to indicate a transient loss of audio focus.
      AudioManager.AUDIOFOCUS_LOSS_TRANSIENT,

      // Used to indicate a transient loss of audio focus where the loser of the audio focus can
      // lower its output volume if it wants to continue playing (also referred to as "ducking"),
      // as the new focus owner doesn't require others to be silent.
      AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK -> {
        synchronized (focusLock) {
          // We should only resume if playback was interrupted
          resumeOnFocusGain = !(player?.isPaused ?: true)
        }
        player?.pause()
      }
    }
  }

  private fun fromAudioFocusChange(focusChange: Int?): String {
    return when (focusChange) {
      AudioManager.AUDIOFOCUS_GAIN -> "AUDIOFOCUS_GAIN"
      AudioManager.AUDIOFOCUS_GAIN_TRANSIENT -> "AUDIOFOCUS_GAIN_TRANSIENT"
      AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE -> "AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE"
      AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK -> "AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK"
      AudioManager.AUDIOFOCUS_LOSS -> "AUDIOFOCUS_LOSS"
      AudioManager.AUDIOFOCUS_LOSS_TRANSIENT -> "AUDIOFOCUS_LOSS_TRANSIENT"
      AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK -> "AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK"
      else -> "AUDIOFOCUS_NONE"
    }
  }

  private fun fromAudioFocusRequest(focusRequest: Int?): String {
    return when(focusRequest) {
      AudioManager.AUDIOFOCUS_REQUEST_GRANTED -> "AUDIOFOCUS_REQUEST_GRANTED"
      AudioManager.AUDIOFOCUS_REQUEST_DELAYED -> "AUDIOFOCUS_REQUEST_DELAYED"
      else -> "AUDIOFOCUS_REQUEST_FAILED"
    }
  }

  /**
   * Send a request to obtain the audio focus
   *
   * @return True if audio focus is granted, false otherwise.
   */
  fun retrieveAudioFocus(): Boolean {
    val result = audioManager?.let {
      AudioManagerCompat.requestAudioFocus(it, audioFocusRequest)
    }
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "retrieveAudioFocus: ${fromAudioFocusRequest(result)}")
    }
    return result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
  }

  /**
   * Abandon audio focus. Causes the previous focus owner, if any, to receive focus.
   */
  fun abandonAudioFocus() {
    synchronized (focusLock) {
      resumeOnFocusGain = false
    }
    val result = audioManager?.let {
      AudioManagerCompat.abandonAudioFocusRequest(it, audioFocusRequest)
    }
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "abandonAudioFocus: ${fromAudioFocusRequest(result)}")
    }
  }
}
