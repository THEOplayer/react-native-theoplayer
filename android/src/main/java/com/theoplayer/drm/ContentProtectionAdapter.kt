package com.theoplayer.drm

import android.text.TextUtils
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.google.gson.Gson
import com.theoplayer.android.api.contentprotection.KeySystemId
import com.theoplayer.android.api.contentprotection.Request
import com.theoplayer.android.api.contentprotection.Response
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.android.api.source.drm.DRMIntegrationId
import com.theoplayer.android.api.source.drm.KeySystemConfiguration
import com.theoplayer.android.api.source.drm.preintegration.*
import org.json.JSONObject

const val PROP_INTEGRATION: String = "integration"
const val PROP_INTEGRATION_ID: String = "integrationId"
const val PROP_INTEGRATION_PARAMETERS: String = "integrationParameters"
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

  const val TAG = "ContentProtection"

  private fun createBridgeData(integrationId: String, keySystemId: KeySystemId): WritableMap {
    return Arguments.createMap().apply {
      putString(PROP_INTEGRATION_ID, integrationId)
      putString(PROP_KEYSYSTEM_ID, KeySystemAdapter.toString(keySystemId))
    }
  }

  fun drmConfigurationFromJson(jsonConfig: JSONObject): DRMConfiguration? {
    // Look for specific DRM pre-integration, otherwise use default.
    val integration: String = jsonConfig.optString(PROP_INTEGRATION)

    var preIntegrationId: DRMIntegrationId? = null
    val gson = Gson()
    if (!TextUtils.isEmpty(integration)) {
      preIntegrationId = DRMIntegrationId.from(integration)
    }

    // Check for pre-integration
    if (preIntegrationId != null) {
      val strConfig = jsonConfig.toString()
      return when (preIntegrationId) {
        DRMIntegrationId.AXINOM -> gson.fromJson(strConfig, AxinomDRMConfiguration::class.java)
        DRMIntegrationId.AZURE -> gson.fromJson(strConfig, AzureDRMConfiguration::class.java)
        DRMIntegrationId.CONAX -> gson.fromJson(strConfig, ConaxDRMConfiguration::class.java)
        DRMIntegrationId.DRMTODAY -> gson.fromJson(strConfig, DRMTodayConfiguration::class.java)
        DRMIntegrationId.IRDETO -> gson.fromJson(strConfig, IrdetoConfiguration::class.java)
        DRMIntegrationId.KEYOS -> gson.fromJson(strConfig, KeyOSDRMConfiguration::class.java)
        DRMIntegrationId.TITANIUM -> gson.fromJson(strConfig, TitaniumDRMConfiguration::class.java)
        DRMIntegrationId.VUDRM -> gson.fromJson(strConfig, VudrmDRMConfiguration::class.java)
        DRMIntegrationId.XSTREAM -> gson.fromJson(strConfig, XstreamConfiguration::class.java)
        else -> {
          Log.e(TAG, "ContentProtection integration not supported: $integration")
          null
        }
      }
    }

    // Custom integration through connector
    return DRMConfiguration.Builder().apply {
      this.customIntegrationId(integration)
      this.widevine(gson.fromJson(jsonConfig.optString("widevine"), KeySystemConfiguration::class.java))
      this.playready(gson.fromJson(jsonConfig.optString("widevine"), KeySystemConfiguration::class.java))
      this.integrationParameters(
        gson.fromJson<Map<String, Any>>(
          jsonConfig.getJSONObject("integrationParameters").toString(),
          MutableMap::class.java
        )
      )
    }.build()
  }

  fun fromDRMConfiguration(config: DRMConfiguration): WritableMap {
    return Arguments.createMap().apply {
      putString(PROP_INTEGRATION, config.customIntegrationId ?: config.integration.integrationId)
      putMap(PROP_INTEGRATION_PARAMETERS, Arguments.createMap().apply {
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

  fun fromResponse(
    integrationId: String,
    keySystemId: KeySystemId,
    response: Response
  ): WritableMap {
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
