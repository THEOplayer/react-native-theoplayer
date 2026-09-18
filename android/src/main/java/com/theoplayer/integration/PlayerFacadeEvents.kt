package com.theoplayer.integration

import com.theoplayer.android.api.event.Event
import com.theoplayer.android.api.event.EventDispatcher
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import java.io.Closeable

@Suppress("FINITE_BOUNDS_VIOLATION_IN_JAVA")
internal class PlayerFacadeEvents<E : Event<*>>(
  private val source: () -> EventDispatcher<E>,
  private val consume: (E) -> Boolean = { false },
  private val after: (E) -> Unit = {},
) : EventDispatcher<E>, Closeable {
  private val subscriptions = linkedMapOf<EventType<*>, PlayerFacadeEventSubscription<E>>()
  private val interceptors = linkedSetOf<(E) -> Boolean>()
  private val retainedTypes = mutableSetOf<EventType<*>>()
  private var closed = false

  override fun <T : E> addEventListener(type: EventType<T>, listener: EventListener<in T>) {
    check(!closed) { "The player facade has been closed." }
    val subscription = subscription(type)
    if (subscription.listeners.containsKey(listener)) return
    @Suppress("UNCHECKED_CAST")
    subscription.listeners[listener] = { listener.handleEvent(it as T) }
  }

  override fun <T : E> removeEventListener(type: EventType<T>, listener: EventListener<in T>) {
    val subscription = subscriptions[type] ?: return
    subscription.listeners.remove(listener)
    release(type, subscription)
  }

  fun <T : E> retain(type: EventType<T>) {
    retainedTypes.add(type)
    subscription(type)
  }

  fun <T : E> intercept(type: EventType<T>, interceptor: (T) -> Boolean): Closeable {
    val subscription = subscription(type)
    @Suppress("UNCHECKED_CAST")
    val callback = interceptor as (E) -> Boolean
    subscription.interceptors.add(callback)
    return Closeable {
      subscription.interceptors.remove(callback)
      release(type, subscription)
    }
  }

  fun interceptAll(interceptor: (E) -> Boolean): Closeable {
    interceptors.add(interceptor)
    return Closeable { interceptors.remove(interceptor) }
  }

  fun dispatch(event: E, isCurrent: () -> Boolean) {
    val subscription = subscriptions[event.type] ?: return
    for ((listener, emit) in subscription.listeners.toMap()) {
      if (!closed && isCurrent() && subscription.listeners.containsKey(listener)) emit(event)
    }
  }

  fun rebind() {
    for ((type, subscription) in subscriptions) {
      subscription.remove()
      subscription.remove = bind(type, subscription)
    }
  }

  private fun <T : E> subscription(type: EventType<T>): PlayerFacadeEventSubscription<E> {
    subscriptions[type]?.let { return it }
    val subscription = PlayerFacadeEventSubscription<E>()
    subscriptions[type] = subscription
    try {
      subscription.remove = bind(type, subscription)
    } catch (error: Exception) {
      subscriptions.remove(type)
      throw error
    }
    return subscription
  }

  @Suppress("UNCHECKED_CAST")
  private fun bind(type: EventType<*>, subscription: PlayerFacadeEventSubscription<E>): () -> Unit {
    val backing = source()
    val eventType = type as EventType<E>
    var attached = true
    val isCurrent = { attached && subscriptions[type] === subscription && source() === backing }
    val forward = EventListener<E> { event ->
      if (closed || !isCurrent()) return@EventListener
      try {
        for (interceptor in subscription.interceptors.toList()) {
          if (interceptor in subscription.interceptors && interceptor(event)) return@EventListener
        }
        for (interceptor in interceptors.toList()) {
          if (interceptor in interceptors && interceptor(event)) return@EventListener
        }
        if (!consume(event)) dispatch(event, isCurrent)
      } finally {
        after(event)
      }
    }
    try {
      backing.addEventListener(eventType, forward)
    } catch (error: Exception) {
      attached = false
      backing.removeEventListener(eventType, forward)
      throw error
    }
    return {
      attached = false
      backing.removeEventListener(eventType, forward)
    }
  }

  private fun release(type: EventType<*>, subscription: PlayerFacadeEventSubscription<E>) {
    if (type in retainedTypes || subscription.listeners.isNotEmpty() || subscription.interceptors.isNotEmpty() || subscriptions[type] !== subscription) return
    subscription.remove()
    subscriptions.remove(type)
  }

  override fun close() {
    if (closed) return
    closed = true
    interceptors.clear()
    val detached = subscriptions.values.toList()
    subscriptions.clear()
    for (subscription in detached) {
      subscription.listeners.clear()
      subscription.interceptors.clear()
      subscription.remove()
    }
  }
}
