package com.theoplayer.util

import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.UIManagerModule

private const val TAG = "ViewResolver"
private const val INVALID_TAG = -1

@Suppress("UNCHECKED_CAST")
class ViewResolver(private val reactContext: ReactApplicationContext) {
  private var uiManager: UIManagerModule? = null

  fun <T: View> resolveViewByTag(tag: Int, onResolved: (view: T?) -> Unit) {
    if (tag == INVALID_TAG) {
      // Don't bother trying to resolve an invalid tag.
      onResolved(null)
    }
    if (uiManager == null) {
      uiManager = reactContext.getNativeModule(UIManagerModule::class.java)
    }
    uiManager?.addUIBlock {
      try {
        onResolved(it.resolveView(tag) as? T?)
      } catch (e: Exception) {
        // The View instance could not be resolved: log but do not forward exception.
        Log.e(TAG, "Failed to resolve View tag $tag: $e")
        onResolved(null)
      }
    }
  }
}
