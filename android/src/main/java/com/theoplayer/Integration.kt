package com.theoplayer

import androidx.annotation.MainThread

@MainThread
interface Integration {
  fun getCurrentTime(): Double? = null
  fun setCurrentTime(currentTime: Double): Boolean = false
  fun play(): Boolean = false
  fun pause(): Boolean = false
  fun isPaused(): Boolean? = null
  fun getDuration(): Double? = null
}
