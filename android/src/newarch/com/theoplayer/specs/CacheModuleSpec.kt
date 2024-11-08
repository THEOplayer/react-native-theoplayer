package com.theoplayer.specs

import com.facebook.fbreact.specs.NativeCacheModuleSpec
import com.facebook.react.bridge.ReactApplicationContext

abstract class CacheModuleSpec internal constructor(context: ReactApplicationContext) :
  NativeCacheModuleSpec(context) {
}
