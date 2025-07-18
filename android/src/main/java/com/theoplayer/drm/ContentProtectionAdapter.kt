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
import com.theoplayer.android.api.source.drm.ClearkeyKeySystemConfiguration
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.android.api.source.drm.DRMIntegrationId
import com.theoplayer.android.api.source.drm.KeySystemConfiguration
import com.theoplayer.android.api.source.drm.LicenseType
import com.theoplayer.android.api.source.drm.preintegration.*
import com.theoplayer.util.BridgeUtils.fromJSONObjectToMap
import org.json.JSONObject

private const val TAG = "ContentProtection"

const val PROP_INTEGRATION: String = "integration"
const val PROP_INTEGRATION_ID: String = "integrationId"
const val PROP_INTEGRATION_PARAMETERS: String = "integrationParameters"
const val PROP_REQUEST: String = "request"
const val PROP_KEYSYSTEM_ID: String = "keySystemId"
const val PROP_DRM_CONFIG: String = "drmConfig"
const val PROP_PLAYREADY: String = "playready"
const val PROP_WIDEVINE: String = "widevine"
const val PROP_CLEARKEY: String = "clearkey"
const val PROP_REQUEST_ID: String = "requestId"
const val PROP_URL: String = "url"
const val PROP_METHOD: String = "method"
const val PROP_STATUS: String = "status"
const val PROP_STATUS_TEXT: String = "statusText"
const val PROP_HEADERS: String = "headers"
const val PROP_BASE64_BODY: String = "base64body"
const val PROP_LA_URL: String = "licenseAcquisitionURL"
const val PROP_USE_CREDENTIALS: String = "useCredentials"
const val PROP_LICENSE_ACQUISITION_URL: String = "licenseAcquisitionURL"
const val PROP_LICENSE_TYPE: String = "licenseType"
const val PROP_LICENSE_TYPE_TEMPORARY: String = "temporary"
const val PROP_LICENSE_TYPE_PERSISTENT: String = "persistent"
const val PROP_QUERY_PARAMETERS: String = "queryParameters"
const val PROP_CERTIFICATE: String = "certificate"
const val PROP_KEYS: String = "keys"
const val PROP_ID: String = "id"
const val PROP_VALUE: String = "value"

object ContentProtectionAdapter {

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
      if (!TextUtils.isEmpty(integration)) {
        customIntegrationId(integration)
      }
      if (jsonConfig.has(PROP_WIDEVINE)) {
        widevine(keySystemConfigurationFromJson(jsonConfig.getJSONObject(PROP_WIDEVINE)))
      }
      if (jsonConfig.has(PROP_PLAYREADY)) {
        playready(keySystemConfigurationFromJson(jsonConfig.getJSONObject(PROP_PLAYREADY)))
      }
      if (jsonConfig.has(PROP_CLEARKEY)) {
        clearkey(clearkeyKeySystemConfigurationFromJson(jsonConfig.getJSONObject(PROP_CLEARKEY)))
      }
      if (jsonConfig.has(PROP_INTEGRATION_PARAMETERS)) {
        integrationParameters(fromJSONObjectToMap(jsonConfig.getJSONObject(PROP_INTEGRATION_PARAMETERS)))
      }
    }.build()
  }

  private fun keySystemConfigurationFromJson(config: JSONObject): KeySystemConfiguration {
    return KeySystemConfiguration.Builder(config.optString(PROP_LICENSE_ACQUISITION_URL)).apply {
      useCredentials(config.optBoolean(PROP_USE_CREDENTIALS))
      licenseTypeFromString(config.optString(PROP_LICENSE_TYPE))?.let {
        licenseType(it)
      }
      headers(fromJSONObjectToMap(config.optJSONObject(PROP_HEADERS)))
      queryParameters(fromJSONObjectToMap(config.optJSONObject(PROP_QUERY_PARAMETERS)))
      if (config.has(PROP_CERTIFICATE)) {
        certificate(config.getString(PROP_CERTIFICATE).toByteArray())
      }
    }.build()
  }

  private fun clearkeyKeySystemConfigurationFromJson(config: JSONObject): ClearkeyKeySystemConfiguration {
    val jsonKeys = config.optJSONArray(PROP_KEYS)
    val keys = mutableListOf<ClearkeyKeySystemConfiguration.ClearkeyDecryptionKey>()
    if (jsonKeys != null) {
      for (i in 0 until jsonKeys.length()) {
        val jsonKey = jsonKeys.optJSONObject(i)
        if (jsonKey != null) {
          val id = jsonKey.optString(PROP_ID)
          val value = jsonKey.optString(PROP_VALUE)
          if (!id.isNullOrEmpty() && !value.isNullOrEmpty()) {
            keys.add(ClearkeyKeySystemConfiguration.ClearkeyDecryptionKey(id, value))
          }
        }
      }
    }
    return ClearkeyKeySystemConfiguration.Builder(config.optString(PROP_LICENSE_ACQUISITION_URL))
      .apply {
        useCredentials(config.optBoolean(PROP_USE_CREDENTIALS))
        headers(fromJSONObjectToMap(config.optJSONObject(PROP_HEADERS)))
        queryParameters(fromJSONObjectToMap(config.optJSONObject(PROP_QUERY_PARAMETERS)))
        keys(keys.toTypedArray())
      }.build()
  }

  private fun licenseTypeFromString(str: String?): LicenseType? {
    return when (str) {
      PROP_LICENSE_TYPE_PERSISTENT -> LicenseType.PERSISTENT
      PROP_LICENSE_TYPE_TEMPORARY -> LicenseType.TEMPORARY
      else -> null
    }
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
      entry.key?.let { key ->
        headers.putString(key, entry.value)
      }
    }
    payload.putMap(PROP_HEADERS, headers)
    payload.putMap(PROP_REQUEST, fromRequest(integrationId, keySystemId, response.request))
    payload.putString(PROP_BASE64_BODY, Base64.encodeToString(response.body, Base64.DEFAULT))
    return payload
  }
}
