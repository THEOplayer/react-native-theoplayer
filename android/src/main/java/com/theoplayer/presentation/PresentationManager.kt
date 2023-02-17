package com.theoplayer.presentation

import android.annotation.SuppressLint
import android.os.Build
import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import com.theoplayer.PlayerEventEmitter
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.android.api.pip.PiPType
import com.theoplayer.android.api.player.PresentationMode

class PresentationManager(private val view: THEOplayerView,
                          private val reactContext: ThemedReactContext,
                          private val eventEmitter: PlayerEventEmitter) {
  private var fullscreen = false

  fun setPresentation(mode: PresentationMode) {
    val currentPresentationMode = view.presentationMode
    when (mode) {
      PresentationMode.INLINE -> {
        if (fullscreen) {
          setFullscreen(false)
        } else if (currentPresentationMode == PresentationMode.PICTURE_IN_PICTURE) {
          view.piPManager?.exitPiP()
        }
      }
      PresentationMode.FULLSCREEN -> {
        if (currentPresentationMode == PresentationMode.PICTURE_IN_PICTURE) {
          view.piPManager?.exitPiP()
        }
        setFullscreen(true)
      }
      PresentationMode.PICTURE_IN_PICTURE -> if (fullscreen) {
        setFullscreen(false)
      } else {
        view.piPManager?.enterPiP(PiPType.ACTIVITY)
      }
    }
  }

  @SuppressLint("ObsoleteSdkInt")
  fun setFullscreen(fullscreen: Boolean) {
    if (fullscreen == this.fullscreen) {
      return
    }
    this.fullscreen = fullscreen
    val activity = reactContext.currentActivity ?: return
    val window = activity.window
    val decorView = window.decorView
    val uiOptions: Int
    if (fullscreen) {
      uiOptions = if (Build.VERSION.SDK_INT >= 19) { // 4.4+
        (FrameLayout.SYSTEM_UI_FLAG_HIDE_NAVIGATION
          or FrameLayout.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
          or FrameLayout.SYSTEM_UI_FLAG_FULLSCREEN)
      } else {
        (FrameLayout.SYSTEM_UI_FLAG_HIDE_NAVIGATION
          or FrameLayout.SYSTEM_UI_FLAG_FULLSCREEN)
      }
      decorView.systemUiVisibility = uiOptions
      // TODO: emit presentationmodechange event
    } else {
      uiOptions = FrameLayout.SYSTEM_UI_FLAG_VISIBLE
      decorView.systemUiVisibility = uiOptions
      // TODO: emit presentationmodechange event
    }
  }
}
