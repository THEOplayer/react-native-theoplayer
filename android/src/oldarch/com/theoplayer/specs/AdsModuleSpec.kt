package com.theoplayer.specs

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap

abstract class AdsModuleSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

    abstract fun schedule(tag: Double, ad: ReadableMap)

    abstract fun currentAdBreak(tag: Double, promise: Promise)

    abstract fun currentAds(tag: Double, promise: Promise)

    abstract fun scheduledAdBreaks(tag: Double, promise: Promise)

    abstract fun playing(tag: Double, promise: Promise)

    abstract fun skip(tag: Double)

    abstract fun daiSnapback(tag: Double, promise: Promise)

    abstract fun daiSetSnapback(tag: Double, enabled: Boolean)

    abstract fun daiContentTimeForStreamTime(tag: Double, time: Double, promise: Promise)

    abstract fun daiStreamTimeForContentTime(tag: Double, time: Double, promise: Promise)

    abstract fun addFriendlyObstruction(tag: Double, obstruction: ReadableMap)

    abstract fun removeAllFriendlyObstructions(tag: Double)
}
