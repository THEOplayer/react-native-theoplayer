package com.theoplayer.specs

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

abstract class CastModuleSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun casting(tag: Double, promise: Promise)

  abstract fun chromecastCasting(tag: Double, promise: Promise)

  abstract fun airplayCasting(tag: Double, promise: Promise)

  abstract fun chromecastState(tag: Double, promise: Promise)

  abstract fun airplayState(tag: Double, promise: Promise)

  abstract fun chromecastStart(tag: Double)

  abstract fun chromecastStop(tag: Double)

  abstract fun chromecastJoin(tag: Double)

  abstract fun chromecastLeave(tag: Double)

  abstract fun airplayStart(tag: Double)

  abstract fun airplayStop(tag: Double)
}
