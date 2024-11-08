package com.theoplayer.specs

import com.facebook.fbreact.specs.NativeContentProtectionModuleSpec
import com.facebook.react.bridge.ReactApplicationContext

abstract class ContentProtectionModuleSpec internal constructor(context: ReactApplicationContext) :
  NativeContentProtectionModuleSpec(context) {
}
