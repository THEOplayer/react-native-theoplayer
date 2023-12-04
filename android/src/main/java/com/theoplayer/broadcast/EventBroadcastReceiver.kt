package com.theoplayer.broadcast

import com.theoplayer.android.api.event.Event

interface EventBroadcastReceiver {
  fun onReceivedEvent(event: Event<*>)
}
