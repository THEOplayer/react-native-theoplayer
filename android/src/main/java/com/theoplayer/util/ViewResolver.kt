package com.theoplayer.util

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.UIManagerModule
import com.theoplayer.ReactTHEOplayerView

class ViewResolver(private val reactContext: ReactApplicationContext) {
  private var uiManager: UIManagerModule? = null

  fun resolveViewByTag(tag: Int, onResolved: (view: ReactTHEOplayerView?) -> Unit) {
    if (uiManager == null) {
      uiManager = reactContext.getNativeModule(UIManagerModule::class.java)
    }
    uiManager?.addUIBlock {
      onResolved(it.resolveView(tag) as ReactTHEOplayerView)
    }
  }
}
