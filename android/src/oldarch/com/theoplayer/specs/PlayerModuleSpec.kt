package com.theoplayer.specs

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

abstract class PlayerModuleSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun version(promise: Promise)

  abstract fun setABRConfig(tag: Double, config: ReadableMap?)

  abstract fun setSource(tag: Double, src: ReadableMap?)

  abstract fun setCurrentTime(tag: Double, time: Double)

  abstract fun setPaused(tag: Double, paused: Boolean)

  abstract fun setMuted(tag: Double, muted: Boolean)

  abstract fun setVolume(tag: Double, volume: Double)

  abstract fun setPlaybackRate(tag: Double, playbackRate: Double)

  abstract fun setSelectedTextTrack(tag: Double, uid: Double?)

  abstract fun setSelectedAudioTrack(tag: Double, uid: Double?)

  abstract fun setSelectedVideoTrack(tag: Double, uid: Double?)

  abstract fun setTargetVideoQuality(tag: Double, uids: ReadableArray)

  abstract fun setPreload(tag: Double, type: String?)

  abstract fun setPresentationMode(tag: Double, type: String?)

  abstract fun setPipConfig(tag: Double, config: ReadableMap?)

  abstract fun setBackgroundAudioConfig(tag: Double, config: ReadableMap)

  abstract fun setAspectRatio(tag: Double, ratio: String)

  abstract fun setKeepScreenOn(tag: Double, value: Boolean)

  abstract fun setTextTrackStyle(tag: Double, style: ReadableMap?)

  abstract fun setRenderingTarget(tag: Double, target: String)
}
