package com.theoplayer.specs

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap

abstract class CacheModuleSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

    abstract fun getInitialState(promise: Promise)

    abstract fun createTask(source: ReadableMap, parameters: ReadableMap)

    abstract fun pauseCachingTask(id: String)

    abstract fun removeCachingTask(id: String)

    abstract fun startCachingTask(id: String)

    abstract fun renewLicense(id: String, drmConfiguration: ReadableMap?)
}
