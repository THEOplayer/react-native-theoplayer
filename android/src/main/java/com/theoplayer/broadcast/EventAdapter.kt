package com.theoplayer.broadcast

import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.ads.AdEventAdapter
import com.theoplayer.android.api.event.Event

private const val EVENT_PROP_TYPE = "type"
private const val PROP_AD_EVENT = "adevent"

private const val TAG = "EventAdapter"

object EventAdapter {
  fun parseEvent(event: ReadableMap?): Event<*>? {
    return when (val eventType = event?.getString(EVENT_PROP_TYPE)) {
      PROP_AD_EVENT -> AdEventAdapter.parseEvent(event)
      else -> {
          Log.w(TAG, "Forwarding events of type $eventType not supported yet.")
        null
      } /*not supported yet*/
    }
  }
}
