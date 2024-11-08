package com.theoplayer.specs

import android.view.ViewGroup
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ViewGroupManager
import com.theoplayer.ReactTHEOplayerView

abstract class THEOplayerViewManagerSpec<T : ViewGroup> : ViewGroupManager<T>() {
  abstract fun setConfig(videoView: ReactTHEOplayerView, config: ReadableMap?)
}
