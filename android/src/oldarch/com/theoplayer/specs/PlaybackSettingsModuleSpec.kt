package com.theoplayer.specs

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

abstract class PlaybackSettingsModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
    abstract fun useFastStartup(useFastStartup: Boolean)

    abstract fun setLipSyncCorrection(correctionMs: Double)
}
