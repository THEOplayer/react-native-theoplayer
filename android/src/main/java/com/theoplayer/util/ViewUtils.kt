package com.theoplayer.util

import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import androidx.core.view.children
import com.facebook.react.ReactRootView
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import kotlin.sequences.forEach

/**
 * Conditionally apply an operation on each view in a hierarchy.
 */
fun applyOnViewTree(view: View, doOp: (View) -> Unit) {
  doOp(view)
  if (view is ViewGroup) {
    view.children.forEach { ch -> applyOnViewTree(ch, doOp) }
  }
}

/**
 * Finds the closest ReactRootView either by searching upwards from the given ReactViewGroup
 * or, if that fails, by searching downwards from the root view of the current activity.
 */
fun findReactRootView(reactContext: ReactContext, reactPlayerGroup: ReactViewGroup? = null): ReactRootView? {
  val activity = reactContext.currentActivity ?: return null
  // Try to search in parents and as a fallback option from root to bottom using depth-first order
  return reactPlayerGroup?.getClosestParentOfType()
    ?: (activity.window.decorView.rootView as? ViewGroup)?.getClosestParentOfType(false)
}

/**
 * Finds the closest parent view of the specified type [T].
 *
 * @param upward If true, searches upwards in the view hierarchy (towards the root).
 *                 If false, searches downwards in the view hierarchy (towards the children).
 * @return The closest parent view of type [T], or null if none is found.
 */
inline fun <reified T : View> ViewGroup.getClosestParentOfType(upward: Boolean = true): T? {
  if (upward) {
    // Search in the parent views of `this` view up to the root
    var parent: ViewParent? = parent
    while (parent != null && parent !is T) {
      parent = parent.parent
    }
    return parent as? T
  } else {
    // Search in the children collection.
    val viewStack = ArrayDeque(children.toList())
    // Use Stack/LIFO instead of recursion
    while (viewStack.isNotEmpty()) {
      when (val view = viewStack.removeAt(0)) {
        is T -> {
          return view
        }

        is ViewGroup -> {
          // Filling LIFO with all children of the ViewGroup: depth-first order
          viewStack.addAll(0, view.children.toList())
        }
      }
    }
    // Found nothing
    return null
  }
}
