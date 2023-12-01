package com.theoplayer.event

import com.theoplayer.android.api.event.Event

interface EventForwarder {
  fun forwardEvent(event: Event<*>)
}
