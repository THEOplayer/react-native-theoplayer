package com.theoplayer.cast

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.cast.Cast
import com.theoplayer.android.api.cast.chromecast.CastError
import com.theoplayer.android.api.cast.chromecast.ErrorCode
import com.theoplayer.android.api.cast.chromecast.PlayerCastState
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.chromecast.CastErrorEvent
import com.theoplayer.android.api.event.chromecast.CastStateChangeEvent
import com.theoplayer.android.api.event.chromecast.ChromecastEventTypes

const val EVENT_PROP_TYPE = "type"
const val EVENT_PROP_STATE = "state"
const val EVENT_PROP_ERROR = "error"
const val EVENT_PROP_ERROR_CODE = "errorCode"
const val EVENT_PROP_ERROR_DESCRIPTION = "description"

class CastEventAdapter(private val castApi: Cast, private val emitter: Emitter) {

  interface Emitter {
    fun emit(payload: WritableMap?)
  }

  private val onCastError = EventListener<CastErrorEvent> { handleCastError(it) }
  private val onStateChange = EventListener<CastStateChangeEvent> { handleStateChange(it) }

  init {
    castApi.chromecast.addEventListener(ChromecastEventTypes.ERROR, onCastError)
    castApi.chromecast.addEventListener(ChromecastEventTypes.STATECHANGE, onStateChange)
  }

  fun destroy() {
    castApi.chromecast.removeEventListener(ChromecastEventTypes.ERROR, onCastError)
    castApi.chromecast.removeEventListener(ChromecastEventTypes.STATECHANGE, onStateChange)
  }

  private fun handleCastError(event: CastErrorEvent) {
    val payload = Arguments.createMap()
    payload.putString(EVENT_PROP_TYPE, "chromecasterror")
    payload.putMap(EVENT_PROP_ERROR, serializeError(event.error))
    emitter.emit(payload)
  }

  private fun serializeError(error: CastError): WritableMap {
    val errorPayload = Arguments.createMap()
    @Suppress("SENSELESS_NULL_IN_WHEN")
    errorPayload.putString(
      EVENT_PROP_ERROR_CODE,
      when (error.errorCode) {
        ErrorCode.CANCEL -> "CANCEL"
        ErrorCode.TIMEOUT -> "TIMEOUT"
        ErrorCode.API_NOT_INITIALIZED -> "API_NOT_INITIALIZED"
        ErrorCode.INVALID_PARAMETER -> "INVALID_PARAMETER"
        ErrorCode.EXTENSION_NOT_COMPATIBLE -> "EXTENSION_NOT_COMPATIBLE"
        ErrorCode.EXTENSION_MISSING -> "EXTENSION_MISSING"
        ErrorCode.RECEIVER_UNAVAILABLE -> "RECEIVER_UNAVAILABLE"
        ErrorCode.SESSION_ERROR -> "SESSION_ERROR"
        ErrorCode.CHANNEL_ERROR -> "CHANNEL_ERROR"
        ErrorCode.LOAD_MEDIA_FAILED -> "LOAD_MEDIA_FAILED"
        null -> ""
      }
    )
    errorPayload.putString(EVENT_PROP_ERROR_DESCRIPTION, error.description)
    return errorPayload
  }

  private fun handleStateChange(event: CastStateChangeEvent) {
    val payload = Arguments.createMap()
    payload.putString(EVENT_PROP_TYPE, "chromecaststatechange")
    if (event.state != null) {
      payload.putString(
        EVENT_PROP_STATE,
        when (event.state) {
          PlayerCastState.UNAVAILABLE -> "unavailable"
          PlayerCastState.AVAILABLE -> "available"
          PlayerCastState.CONNECTING -> "connecting"
          PlayerCastState.CONNECTED -> "connected"
          null -> "unavailable"
        }
      )
    }
    emitter.emit(payload)
  }
}
