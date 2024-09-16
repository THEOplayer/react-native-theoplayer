package com.theoplayer.util

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.fabric.FabricUIManager
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.common.UIManagerType
import com.theoplayer.BuildConfig
import com.theoplayer.ReactTHEOplayerView

private const val TAG = "ViewResolver"
private const val INVALID_TAG = -1

class ViewResolver(private val reactContext: ReactApplicationContext) {
  fun resolveViewByTag(tag: Int, onResolved: (view: ReactTHEOplayerView?) -> Unit) {
    if (tag == INVALID_TAG) {
      // Don't bother trying to resolve an invalid tag.
      onResolved(null)
    }
    try {
      if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
        (UIManagerHelper.getUIManager(this.reactContext, UIManagerType.FABRIC) as? FabricUIManager)?.addUIBlock {
          onResolved(it.resolveView(tag) as ReactTHEOplayerView)
        }
      } else {
        reactContext.getNativeModule(UIManagerModule::class.java)?.addUIBlock {
          onResolved(it.resolveView(tag) as ReactTHEOplayerView)
        }
      }
    } catch (e: Exception) {
      // The ReactTHEOplayerView instance could not be resolved: log but do not forward exception.
      Log.e(TAG, "Failed to resolve ReactTHEOplayerView tag $tag: $e")
      onResolved(null)
    }
  }
}
