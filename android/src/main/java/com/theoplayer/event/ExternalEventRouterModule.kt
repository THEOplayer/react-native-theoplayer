package com.theoplayer.event

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver
import java.util.concurrent.ConcurrentHashMap

private const val TAG = "ExternalEventRouterModule"

@ReactModule(name = TAG)
class ExternalEventRouterModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

  private val eventForwarders = ConcurrentHashMap<Int, MutableList<EventForwarder>>()
  private val viewResolver: ViewResolver

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  fun addEventForwarder(tag: Int, forwarder: EventForwarder) {
    if (!eventForwarders.contains(tag)) {
      eventForwarders[tag] = mutableListOf()
    }
    eventForwarders[tag]?.add(forwarder)
  }

  fun removeEventForwarder(tag: Int, forwarder: EventForwarder) {
    eventForwarders[tag]?.remove(forwarder)
  }

  @ReactMethod
  fun dispatchEvent(tag: Int, event: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      if (view != null) {
        EventAdapter.parseEvent(event)?.also {
          eventForwarders[tag]?.forEach { forwarder ->
            forwarder.forwardEvent(it)
          }
        }
      }
    }
  }
}
