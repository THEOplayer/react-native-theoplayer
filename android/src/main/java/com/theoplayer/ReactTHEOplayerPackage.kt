package com.theoplayer

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.NativeModule
import com.facebook.react.uimanager.ViewManager
import com.theoplayer.ads.AdsModule
import com.theoplayer.drm.ContentProtectionModule
import com.theoplayer.cast.CastModule
import com.theoplayer.player.PlayerModule

class ReactTHEOplayerPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(
      PlayerModule(reactContext),
      AdsModule(reactContext),
      ContentProtectionModule(reactContext),
      CastModule(reactContext)
    )
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf<ViewManager<*, *>>(ReactTHEOplayerViewManager())
  }
}
