package com.theoplayer.broadcast

import com.facebook.react.bridge.ReadableMap
import com.theoplayer.ReactTHEOplayerView

class EventBroadcastAdapter(private val view: ReactTHEOplayerView): DefaultEventDispatcher() {
  /**
   * Convert a react-native event to a native event and broadcast it.
   */
  fun broadcastEvent(event: ReadableMap) {
    EventAdapter.parseEvent(event)?.also {
      view.broadcast.dispatchEvent(it)
    }
  }
}
