package com.theoplayer.broadcast

import com.theoplayer.android.api.event.EventDispatcher
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.Event

open class DefaultEventDispatcher: EventDispatcher<Event<*>> {
    private val _listeners = mutableMapOf<EventType<*>, MutableList<EventListener<*>>>()

    override fun <T : Event<*>> addEventListener(eventType: EventType<T>, listener: EventListener<in T>) {
        if (!_listeners.contains(eventType)) {
            _listeners[eventType] = mutableListOf()
        }
        _listeners[eventType]?.add(listener)
    }

    override fun <T : Event<*>> removeEventListener(eventType: EventType<T>, listener: EventListener<in T>) {
       _listeners[eventType]?.remove(listener)
    }

    fun dispatchEvent(event: Event<*>) {
        _listeners[event.type]?.forEach { listener ->
          @Suppress("UNCHECKED_CAST")
          (listener as EventListener<Event<*>>).handleEvent(event)
        }
    }
}
