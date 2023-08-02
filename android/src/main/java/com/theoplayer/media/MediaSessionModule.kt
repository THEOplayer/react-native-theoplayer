package com.theoplayer.media

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "MediaSessionModule"

class MediaSessionModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val viewResolver: ViewResolver = ViewResolver(context)

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun setActive(tag: Int, active: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.mediaSessionConnector?.setActive(active)
    }
  }
}
