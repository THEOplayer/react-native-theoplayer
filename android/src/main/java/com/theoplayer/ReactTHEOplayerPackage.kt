package com.theoplayer

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.NativeModule
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.theoplayer.ads.AdsModule
import com.theoplayer.cache.CacheModule
import com.theoplayer.drm.ContentProtectionModule
import com.theoplayer.cast.CastModule
import com.theoplayer.broadcast.EventBroadcastModule
import com.theoplayer.playback.PlaybackSettingsModule
import com.theoplayer.player.PlayerModule

class ReactTHEOplayerPackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      PlayerModule.NAME -> PlayerModule(reactContext)
      AdsModule.NAME -> AdsModule(reactContext)
      ContentProtectionModule.NAME -> ContentProtectionModule(reactContext)
      CastModule.NAME -> CastModule(reactContext)
      CacheModule.NAME -> CacheModule(reactContext)
      EventBroadcastModule.NAME -> EventBroadcastModule(reactContext)
      PlaybackSettingsModule.NAME -> PlaybackSettingsModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val isTurboModule: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      listOf(
        PlayerModule.NAME,
        AdsModule.NAME,
        ContentProtectionModule.NAME,
        CastModule.NAME,
        CacheModule.NAME,
        EventBroadcastModule.NAME,
        PlaybackSettingsModule.NAME
      ).forEach { moduleName ->
        moduleInfos[moduleName] = ReactModuleInfo(
          moduleName,
          moduleName,
          _canOverrideExistingModule = false,
          _needsEagerInit = false,
          isCxxModule = false,
          isTurboModule = isTurboModule
        )
      }
      moduleInfos
    }
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf<ViewManager<*, *>>(ReactTHEOplayerViewManager())
  }
}
