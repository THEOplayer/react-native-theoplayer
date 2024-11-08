package com.theoplayer.specs

import com.facebook.fbreact.specs.NativePlayerModuleSpec
import com.facebook.react.bridge.ReactApplicationContext

abstract class PlayerModuleSpec internal constructor(context: ReactApplicationContext) :
  NativePlayerModuleSpec(context) {
}
