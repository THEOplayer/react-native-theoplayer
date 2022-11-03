package com.theoplayer.drm

import android.os.Handler
import android.os.Looper
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.google.gson.Gson
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.contentprotection.*
import com.theoplayer.android.api.source.drm.DRMConfiguration

const val PROP_INTEGRATION_ID: String = "integrationId"
const val PROP_KEYSYSTEM_ID: String = "keySystemId"
const val PROP_REQUEST_ID: String = "requestId"
const val PROP_URL: String = "url"
const val PROP_METHOD: String = "method"
const val PROP_HEADERS: String = "headers"
const val PROP_BASE64_BODY: String = "base64body"

class ContentProtectionModule(private val context: ReactApplicationContext): ReactContextBaseJavaModule(context) {
  private val handler = Handler(Looper.getMainLooper())

  private var requestId: Int = 0

  private var gson = Gson()

  private val requestQueue: HashMap<String, (result: ReadableMap) -> Unit> = HashMap()

  override fun getName(): String {
    return "ContentProtectionModule"
  }

  @ReactMethod
  fun registerContentProtectionIntegration(integrationId: String, keySystemIdStr: String) {
    val keySystemId = KeySystemAdapter.fromString(keySystemIdStr)
    if (keySystemId != null) {
      handler.post {
        val factory = ProxyContentProtectionIntegrationFactory(integrationId, keySystemId, this)
        THEOplayerGlobal.getSharedInstance(context.applicationContext)
          .registerContentProtectionIntegration(integrationId, keySystemId, factory)
      }
    } else {
      Log.e(name, "Invalid keySystemId $keySystemIdStr")
    }
  }

  @ReactMethod
  fun onBuildProcessed(data: ReadableMap) {
    val requestId = data.getString(PROP_REQUEST_ID)
  }

  @ReactMethod
  fun onCertificateRequestProcessed(data: ReadableMap) {
    val requestId = data.getString(PROP_REQUEST_ID)
  }

  @ReactMethod
  fun onCertificateResponseProcessed(data: ReadableMap) {
    val requestId = data.getString(PROP_REQUEST_ID)
  }

  @ReactMethod
  fun onLicenseRequestProcessed(data: ReadableMap) {
    val requestId = data.getString(PROP_REQUEST_ID)
    val response = requestQueue.remove(requestId)
    if (response != null) {
      response(data)
    } else {
      // TODO: error
    }
  }

  @ReactMethod
  fun onLicenseResponseProcessed(data: ReadableMap) {
    val requestId = data.getString(PROP_REQUEST_ID)
  }

  fun onBuild(integrationId: String, keySystemId: KeySystemId, config: DRMConfiguration?) {
    val params = createBridgeData(integrationId, keySystemId)
    params.putString("drmConfig", "TODO")
    emit("onBuildIntegration", params)
  }

  fun onCertificateRequest(integrationId: String, keySystemId: KeySystemId, request: Request, callback: CertificateRequestCallback) {
    val data = createBridgeData(integrationId, keySystemId)
    val requestId = createRequestId()
    data.putString(PROP_REQUEST_ID, requestId)
    emit("onCertificateRequest", data)
  }

  fun onCertificateResponse(integrationId: String, keySystemId: KeySystemId, response: Response, callback: CertificateResponseCallback) {
    val data = createBridgeData(integrationId, keySystemId)
    val requestId = createRequestId()
    data.putString(PROP_REQUEST_ID, requestId)
    emit("onCertificateResponse", data)
  }

  fun onLicenseRequest(integrationId: String, keySystemId: KeySystemId, request: Request, callback: LicenseRequestCallback) {
    val data = createBridgeData(integrationId, keySystemId)
    val requestId = createRequestId()
    data.putString(PROP_REQUEST_ID, requestId)
    data.putString(PROP_URL, request.url)
    data.putString(PROP_METHOD, RequestMethodAdapter.toString(request.method))
    val headers = Arguments.createMap()
    request.headers.entries.forEach { entry ->
      headers.putString(entry.key, entry.value)
    }
    data.putMap(PROP_HEADERS, headers)
    data.putString(PROP_BASE64_BODY, Base64.encodeToString(request.body, Base64.DEFAULT))
    requestQueue[requestId] = { modifiedRequest ->
      // Override properties from modified request
      request.url = modifiedRequest.getString(PROP_URL)!!
      request.method = RequestMethodAdapter.fromString(modifiedRequest.getString(PROP_METHOD))
      request.headers = modifiedRequest.getMap(PROP_HEADERS)?.toHashMap() as HashMap<String, String>
      callback.request(request)
    }
    emit("onLicenseRequest", data)
  }

  fun onLicenseResponse(integrationId: String, keySystemId: KeySystemId, response: Response, callback: LicenseResponseCallback) {
    val params = createBridgeData(integrationId, keySystemId)
    emit("onLicenseResponse", params)
  }

  @ReactMethod
  fun addListener(eventName: String?) {
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
  }

  private fun emit(eventName: String, data: WritableMap) {
    context
      .getJSModule(RCTDeviceEventEmitter::class.java)
      .emit(eventName, data)
  }

  private fun createRequestId(): String {
    return (requestId++).toString()
  }

  private fun createBridgeData(integrationId: String, keySystemId: KeySystemId): WritableMap {
    return Arguments.createMap().apply {
      putString(PROP_INTEGRATION_ID, integrationId)
      putString(PROP_KEYSYSTEM_ID, KeySystemAdapter.toString(keySystemId))
    }
  }
}
