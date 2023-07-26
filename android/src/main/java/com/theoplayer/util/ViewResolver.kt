package com.theoplayer.util

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.UIManagerModule
import com.theoplayer.ReactTHEOplayerView

private const val TAG = "ViewResolver"
private const val INVALID_TAG = -1

class ViewResolver(private val reactContext: ReactApplicationContext) {
  private var uiManager: UIManagerModule? = null

  fun resolveViewByTag(tag: Int, onResolved: (view: ReactTHEOplayerView?) -> Unit) {
    if (tag == INVALID_TAG) {
      // Don't bother trying to resolve an invalid tag.
      onResolved(null)
    }
    if (uiManager == null) {
      uiManager = reactContext.getNativeModule(UIManagerModule::class.java)
    }
    uiManager?.addUIBlock {
      try {
        onResolved(it.resolveView(tag) as ReactTHEOplayerView)
      } catch (ignore: Exception) {
        // The ReactTHEOplayerView instance could not be resolved: log but do not forward exception.
        Log.w(TAG, "Failed to resolve ReactTHEOplayerView tag $tag")
        onResolved(null)
      }
    }
  }
}
