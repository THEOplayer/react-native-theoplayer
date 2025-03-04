package com.theoplayer.presentation

import android.util.Log
import android.view.ViewTreeObserver
import com.facebook.react.views.view.ReactViewGroup

private val TAG = "FSLayoutObserver"

/**
 * FullScreenLayoutObserver makes sure that the React Native view does not get the layout
 * defined in React-Native during fullscreen presentation mode. We want to enforce fullscreen
 * position & size.
 */
class FullScreenLayoutObserver {
  private var globalLayoutListener: ViewTreeObserver.OnGlobalLayoutListener? = null
  private var attached: ReactViewGroup? = null

  fun attach(viewGroup: ReactViewGroup?) {
    if (attached != null) {
      Log.w(TAG, "A previously attached ViewGroup was not properly detached.")
    }

    viewGroup?.let {
      globalLayoutListener = ViewTreeObserver.OnGlobalLayoutListener {
        it.post {
          it.layout(0, 0, viewGroup.width, viewGroup.height)
        }
      }
      it.viewTreeObserver.addOnGlobalLayoutListener(globalLayoutListener)
      attached = viewGroup
    }
  }

  fun remove() {
    attached?.viewTreeObserver?.removeOnGlobalLayoutListener(globalLayoutListener)
    attached = null
    globalLayoutListener = null
  }
}
