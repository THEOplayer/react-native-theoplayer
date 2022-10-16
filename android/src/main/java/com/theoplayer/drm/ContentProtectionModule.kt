package com.theoplayer.drm

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegrationFactory
import com.theoplayer.android.api.contentprotection.KeySystemId

class ContentProtectionModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val factories = HashMap<String, ContentProtectionIntegrationFactory>()

  private val emitter = ContentProtectionBridge();

  override fun getName(): String {
    return "ContentProtectionModule"
  }

  @ReactMethod
  fun registerContentProtectionIntegration(integrationId: String, keySystemIdStr: String) {
    val keySystemId: KeySystemId? = KeySystemAdapter.fromString(keySystemIdStr)
    if (keySystemId != null) {
      val factory = CustomContentProtectionIntegrationFactory(integrationId, keySystemId, emitter)
      factories[integrationId] = factory

      THEOplayerGlobal.getSharedInstance(context)
        .registerContentProtectionIntegration(integrationId, keySystemId, factory)
    } else {
      Log.e(name, "Invalid keySystemId $keySystemIdStr")
    }
  }

  @ReactMethod
  fun onCallback() {

  }

  // Required for rn built in EventEmitter Calls.
  @ReactMethod
  fun addListener(eventName: String?) {
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
  }
}
