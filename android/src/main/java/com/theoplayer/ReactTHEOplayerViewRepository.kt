package com.theoplayer

import java.lang.ref.WeakReference
import java.util.concurrent.CopyOnWriteArrayList

/**
 * A repository with all active THEOplayerViews.
 */
object ReactTHEOplayerViewRepository {
  private val views = CopyOnWriteArrayList<WeakReference<ReactTHEOplayerView>>()

  fun addView(view: ReactTHEOplayerView) {
    views.add(WeakReference(view))
  }

  fun dropView(view: ReactTHEOplayerView) {
    views.removeAll { it.get() == view || it.get() == null }
  }

  fun getViews(): List<ReactTHEOplayerView> {
    return views.mapNotNull { it.get() }
  }
}
