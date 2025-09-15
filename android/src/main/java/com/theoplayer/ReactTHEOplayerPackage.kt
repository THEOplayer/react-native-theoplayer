package com.theoplayer

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.NativeModule
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.theoplayer.ads.AdsModule
import com.theoplayer.cache.CacheModule
import com.theoplayer.drm.ContentProtectionModule
import com.theoplayer.cast.CastModule
import com.theoplayer.broadcast.EventBroadcastModule
import com.theoplayer.player.PlayerModule
import com.theoplayer.theolive.THEOliveModule
import com.theoplayer.theoads.THEOadsModule

@Suppress("unused")
class ReactTHEOplayerPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      PlayerModule.NAME -> PlayerModule(reactContext)
      AdsModule.NAME -> AdsModule(reactContext)
      ContentProtectionModule.NAME -> ContentProtectionModule(reactContext)
      CastModule.NAME -> CastModule(reactContext)
      CacheModule.NAME -> CacheModule(reactContext)
      EventBroadcastModule.NAME -> EventBroadcastModule(reactContext)
      THEOliveModule.NAME -> THEOliveModule(reactContext)
      THEOadsModule.NAME -> THEOadsModule(reactContext)
      else -> null
    }
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf<ViewManager<*, *>>(ReactTHEOplayerViewManager())
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
        PlayerModule.NAME to PlayerModule.INFO,
        AdsModule.NAME to AdsModule.INFO,
        ContentProtectionModule.NAME to ContentProtectionModule.INFO,
        CastModule.NAME to CastModule.INFO,
        CacheModule.NAME to CacheModule.INFO,
        EventBroadcastModule.NAME to EventBroadcastModule.INFO,
        THEOliveModule.NAME to THEOliveModule.INFO,
        THEOadsModule.NAME to THEOadsModule.INFO,
      )
    }
  }
}
