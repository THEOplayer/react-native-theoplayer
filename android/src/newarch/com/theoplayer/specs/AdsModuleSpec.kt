package com.theoplayer.specs

import com.facebook.fbreact.specs.NativeAdsModuleSpec
import com.facebook.react.bridge.ReactApplicationContext

abstract class AdsModuleSpec internal constructor(context: ReactApplicationContext) :
  NativeAdsModuleSpec(context) {
}
