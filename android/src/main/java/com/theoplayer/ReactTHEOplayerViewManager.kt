package com.theoplayer

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

private const val REACT_CLASS = "THEOplayerRCTView"

private const val PROP_CONFIG = "config"

class ReactTHEOplayerViewManager : ViewGroupManager<ReactTHEOplayerView>() {
  override fun getName(): String {
    return REACT_CLASS
  }

  override fun createViewInstance(reactContext: ThemedReactContext): ReactTHEOplayerView {
    return ReactTHEOplayerView(reactContext).also { view ->
      ReactTHEOplayerViewRepository.addView(view)
    }
  }

  /**
   * Called when view is detached from view hierarchy and allows for some additional cleanup by the
   * {@link ViewManager} subclass.
   */
  override fun onDropViewInstance(view: ReactTHEOplayerView) {
    ReactTHEOplayerViewRepository.dropView(view)
    view.releasePlayer()
  }

  @ReactProp(name = PROP_CONFIG)
  fun setConfig(videoView: ReactTHEOplayerView, config: ReadableMap?) {
    videoView.initialize(PlayerConfigAdapter(config))
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
    return PlayerEventEmitter.Events.associateWith { mapOf("registrationName" to it) }
  }
}
