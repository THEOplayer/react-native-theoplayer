package com.theoplayer.drm

import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.contentprotection.KeySystemId
import com.theoplayer.android.api.contentprotection.Request
import com.theoplayer.android.api.contentprotection.Response
import com.theoplayer.android.api.source.drm.DRMConfiguration

const val PROP_INTEGRATION: String = "integration"
const val PROP_INTEGRATION_ID: String = "integrationId"
const val PROP_REQUEST: String = "request"
const val PROP_KEYSYSTEM_ID: String = "keySystemId"
const val PROP_DRM_CONFIG: String = "drmConfig"
const val PROP_WIDEVINE: String = "widevine"
const val PROP_REQUEST_ID: String = "requestId"
const val PROP_URL: String = "url"
const val PROP_METHOD: String = "method"
const val PROP_STATUS: String = "status"
const val PROP_STATUS_TEXT: String = "statusText"
const val PROP_HEADERS: String = "headers"
const val PROP_BASE64_BODY: String = "base64body"
const val PROP_LA_URL: String = "licenseAcquisitionURL"
const val PROP_USE_CREDENTIALS: String = "useCredentials"

object ContentProtectionAdapter {

  private fun createBridgeData(integrationId: String, keySystemId: KeySystemId): WritableMap {
    return Arguments.createMap().apply {
      putString(PROP_INTEGRATION_ID, integrationId)
      putString(PROP_KEYSYSTEM_ID, KeySystemAdapter.toString(keySystemId))
    }
  }

  fun fromDRMConfiguration(config: DRMConfiguration): WritableMap {
    return Arguments.createMap().apply {
      putString(PROP_INTEGRATION, config.customIntegrationId ?: config.integration.integrationId)
      putMap(PROP_KEYSYSTEM_ID, Arguments.createMap().apply {
        config.integrationParameters.forEach { entry ->
          putString(entry.key, entry.value as String)
        }
      })
      val widevine = config.widevine
      if (widevine != null) {
        putMap(PROP_WIDEVINE, Arguments.createMap().apply {
          putString(PROP_LA_URL, widevine.licenseAcquisitionURL)
          putBoolean(PROP_USE_CREDENTIALS, widevine.isUseCredentials)
        })
      }
    }
  }

  fun fromRequest(integrationId: String, keySystemId: KeySystemId, request: Request): WritableMap {
    val payload = createBridgeData(integrationId, keySystemId)
    payload.putString(PROP_URL, request.url)
    payload.putString(PROP_METHOD, RequestMethodAdapter.toString(request.method))
    val headers = Arguments.createMap()
    request.headers.entries.forEach { entry ->
      headers.putString(entry.key, entry.value)
    }
    payload.putMap(PROP_HEADERS, headers)
    payload.putString(PROP_BASE64_BODY, Base64.encodeToString(request.body, Base64.DEFAULT))
    return payload
  }

  fun fromResponse(integrationId: String, keySystemId: KeySystemId, response: Response): WritableMap {
    val payload = createBridgeData(integrationId, keySystemId)
    payload.putString(PROP_URL, response.url)
    payload.putInt(PROP_STATUS, response.status)
    payload.putString(PROP_STATUS_TEXT, response.statusText)
    val headers = Arguments.createMap()
    response.headers.entries.forEach { entry ->
      headers.putString(entry.key, entry.value)
    }
    payload.putMap(PROP_HEADERS, headers)
    payload.putMap(PROP_REQUEST, fromRequest(integrationId, keySystemId, response.request))
    payload.putString(PROP_BASE64_BODY, Base64.encodeToString(response.body, Base64.DEFAULT))
    return payload
  }
}
