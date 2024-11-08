package com.theoplayer.specs

import com.facebook.fbreact.specs.NativeEventBroadcastModuleSpec
import com.facebook.react.bridge.ReactApplicationContext

abstract class EventBroadcastModuleSpec internal constructor(context: ReactApplicationContext) :
  NativeEventBroadcastModuleSpec(context) {
}
