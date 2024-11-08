package com.theoplayer.specs

import com.facebook.fbreact.specs.NativeCastModuleSpec
import com.facebook.react.bridge.ReactApplicationContext

abstract class CastModuleSpec internal constructor(context: ReactApplicationContext) :
  NativeCastModuleSpec(context) {
}
