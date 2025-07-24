package com.theoplayer.player

import com.facebook.react.bridge.*
import com.theoplayer.*
import com.theoplayer.util.ViewResolver

private const val TAG = "THEORCTTHEOliveModule"

@Suppress("unused")
class THEOliveModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val viewResolver: ViewResolver = ViewResolver(context)

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun setAuthToken(tag: Int, token: String) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      //view?.player?.theoLive.authToken = token
      print("[NATIVE] THEOlive authToken updated: ${token}")
    }
  }
}
