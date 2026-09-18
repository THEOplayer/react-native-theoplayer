package com.theoplayer.integration

import com.theoplayer.android.api.event.Event
import com.theoplayer.android.api.event.EventListener

@Suppress("FINITE_BOUNDS_VIOLATION_IN_JAVA")
internal class PlayerFacadeEventSubscription<E : Event<*>> {
  val listeners = linkedMapOf<EventListener<*>, (E) -> Unit>()
  val interceptors = linkedSetOf<(E) -> Boolean>()
  var remove: () -> Unit = {}
}
