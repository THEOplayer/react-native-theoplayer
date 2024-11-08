package com.theoplayer.specs

import android.view.ViewGroup

import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.THEOplayerRCTViewManagerDelegate
import com.facebook.react.viewmanagers.THEOplayerRCTViewManagerInterface

abstract class THEOplayerViewManagerSpec<T : ViewGroup> :
  ViewGroupManager<T>(),
  THEOplayerRCTViewManagerInterface<T> {
  private val mDelegate: ViewManagerDelegate<T> = THEOplayerRCTViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<T>? {
    return mDelegate
  }
}
