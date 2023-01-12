package com.theoplayer.util

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.UIManagerModule
import com.theoplayer.ReactTHEOplayerView

class ViewResolver(private val reactContext: ReactApplicationContext) {
    private var uiManager: UIManagerModule? = null
    private val handler = Handler(Looper.getMainLooper())

    fun resolveViewByTag(tag: Int, onResolved: (view: ReactTHEOplayerView?) -> Unit) {
        if (uiManager == null) {
            uiManager = reactContext.getNativeModule(UIManagerModule::class.java)
        }
        handler.post { onResolved(uiManager?.resolveView(tag) as ReactTHEOplayerView) }
    }
}
