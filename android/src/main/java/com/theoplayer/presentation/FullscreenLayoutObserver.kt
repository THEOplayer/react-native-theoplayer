package com.theoplayer.presentation

import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import androidx.core.view.children
import com.facebook.react.views.view.ReactViewGroup
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.applyOnViewTree

private const val TAG = "FSLayoutObserver"

/**
 * FullScreenLayoutObserver makes sure that the React Native view does not get the layout
 * defined in ReactNative during fullscreen presentation mode. We want to enforce fullscreen
 * position & size.
 * Similarly for picture-in-picture presentation mode, enforce a view that stretches the whole screen.
 */
class FullScreenLayoutObserver {
  private var globalLayoutListener: ViewTreeObserver.OnGlobalLayoutListener? = null
  private var attached: ReactViewGroup? = null

  fun attach(viewGroup: ReactViewGroup?) {
    if (attached != null) {
      Log.w(TAG, "A previously attached ViewGroup was not properly detached.")
    }

    viewGroup?.let { reactPlayerGroup ->
      globalLayoutListener = ViewTreeObserver.OnGlobalLayoutListener {
        val root = getRootViewFrom(reactPlayerGroup)
        reactPlayerGroup.post {
          applyOnViewTree(reactPlayerGroup) { view ->
            if (view == reactPlayerGroup || view is ReactTHEOplayerView) {
              view.measure(
                View.MeasureSpec.makeMeasureSpec(root.width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(root.height, View.MeasureSpec.EXACTLY)
              )
              view.layout(0, 0, view.measuredWidth, view.measuredHeight)
            }
          }
        }
      }
      reactPlayerGroup.viewTreeObserver.addOnGlobalLayoutListener(globalLayoutListener)
      attached = viewGroup
    }
  }

  fun remove() {
    attached?.viewTreeObserver?.removeOnGlobalLayoutListener(globalLayoutListener)
    attached = null
    globalLayoutListener = null
  }
}
