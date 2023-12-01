package com.theoplayer.event

import com.theoplayer.android.api.event.Event

interface BroadcastReceiver {
  fun onReceivedEvent(event: Event<*>)
}
