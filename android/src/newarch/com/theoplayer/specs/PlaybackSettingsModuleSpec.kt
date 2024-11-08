package com.theoplayer.specs

import com.facebook.fbreact.specs.NativePlaybackSettingsModuleSpec
import com.facebook.react.bridge.ReactApplicationContext

abstract class PlaybackSettingsModuleSpec internal constructor(context: ReactApplicationContext) :
  NativePlaybackSettingsModuleSpec(context) {
}
