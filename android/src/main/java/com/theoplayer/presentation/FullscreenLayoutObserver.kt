package com.theoplayer.presentation

import android.view.ViewTreeObserver
import com.facebook.react.views.view.ReactViewGroup

/**
 * FullScreenLayoutObserver makes sure that the React Native view does not get the layout
 * defined in React-Native during fullscreen presentation mode. We want to enforce fullscreen
 * position & size.
 */
class FullScreenLayoutObserver {
  private var globalLayoutListener: ViewTreeObserver.OnGlobalLayoutListener? = null

  fun attach(viewGroup: ReactViewGroup?) {
    viewGroup?.let {
      globalLayoutListener = ViewTreeObserver.OnGlobalLayoutListener {
        it.post {
          it.layout(0, 0, viewGroup.width, viewGroup.height)
        }
      }
      it.viewTreeObserver.addOnGlobalLayoutListener(globalLayoutListener)
    }
  }

  fun remove(viewGroup: ReactViewGroup?) {
    viewGroup?.viewTreeObserver?.removeOnGlobalLayoutListener(globalLayoutListener)
    globalLayoutListener = null
  }
}
