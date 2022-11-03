package com.theoplayer.drm

import android.os.Handler
import android.os.Looper
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.contentprotection.*
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.drm.ContentProtectionAdapter.fromDRMConfiguration

const val TAG = "ContentProtectionModule"

class ContentProtectionModule(private val context: ReactApplicationContext): ReactContextBaseJavaModule(context) {
  private val handler = Handler(Looper.getMainLooper())

  private var requestId: Int = 0

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
      Log.e(TAG, "Invalid keySystemId $keySystemIdStr")
    }
  }

  @ReactMethod
  fun onBuildProcessed(payload: ReadableMap) {
    receive("onBuildProcessed", payload)
  }

  @ReactMethod
  fun onCertificateRequestProcessed(payload: ReadableMap) {
    receive("onCertificateRequestProcessed", payload)
  }

  @ReactMethod
  fun onCertificateResponseProcessed(payload: ReadableMap) {
    receive("onCertificateResponseProcessed", payload)
  }

  @ReactMethod
  fun onLicenseRequestProcessed(payload: ReadableMap) {
    receive("onLicenseRequestProcessed", payload)
  }

  @ReactMethod
  fun onLicenseResponseProcessed(payload: ReadableMap) {
    receive("onLicenseResponseProcessed", payload)
  }

  fun onBuild(integrationId: String, keySystemId: KeySystemId, config: DRMConfiguration?) {
    val payload = createBridgeData(integrationId, keySystemId)
    if (config != null) {
      payload.putMap(PROP_DRM_CONFIG, fromDRMConfiguration(config))
    }
    val requestId = createRequestId()
    payload.putString(PROP_REQUEST_ID, requestId)
    requestQueue[requestId] = { result ->
      // ignore
    }
    emit("onBuildIntegration", payload)
  }

  fun onCertificateRequest(integrationId: String, keySystemId: KeySystemId, request: Request, callback: CertificateRequestCallback) {
    val payload = ContentProtectionAdapter.fromRequest(integrationId, keySystemId, request)
    val requestId = createRequestId()
    payload.putString(PROP_REQUEST_ID, requestId)
    requestQueue[requestId] = { result ->
      // Override properties from modified request
      request.url = result.getString(PROP_URL)!!
      request.method = RequestMethodAdapter.fromString(result.getString(PROP_METHOD))
      request.headers = result.getMap(PROP_HEADERS)?.toHashMap() as HashMap<String, String>
      request.body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
      callback.request(request)
    }
    emit("onCertificateRequest", payload)
  }

  fun onCertificateResponse(integrationId: String, keySystemId: KeySystemId, response: Response, callback: CertificateResponseCallback) {
    val payload = ContentProtectionAdapter.fromResponse(integrationId, keySystemId, response)
    val requestId = createRequestId()
    payload.putString(PROP_REQUEST_ID, requestId)
    requestQueue[requestId] = { result ->
      val body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
      callback.respond(body)
    }
    emit("onCertificateResponse", payload)
  }

  fun onLicenseRequest(integrationId: String, keySystemId: KeySystemId, request: Request, callback: LicenseRequestCallback) {
    val payload = ContentProtectionAdapter.fromRequest(integrationId, keySystemId, request)
    val requestId = createRequestId()
    payload.putString(PROP_REQUEST_ID, requestId)
    requestQueue[requestId] = { result ->
      // Override properties from modified request
      request.url = result.getString(PROP_URL)!!
      request.method = RequestMethodAdapter.fromString(result.getString(PROP_METHOD))
      request.headers = result.getMap(PROP_HEADERS)?.toHashMap() as HashMap<String, String>
      request.body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
      callback.request(request)
    }
    emit("onLicenseRequest", payload)
  }

  fun onLicenseResponse(integrationId: String, keySystemId: KeySystemId, response: Response, callback: LicenseResponseCallback) {
    val payload = ContentProtectionAdapter.fromResponse(integrationId, keySystemId, response)
    val requestId = createRequestId()
    payload.putString(PROP_REQUEST_ID, requestId)
    requestQueue[requestId] = { result ->
      val body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
      callback.respond(body)
    }
    emit("onLicenseResponse", payload)
  }

  @ReactMethod
  fun addListener(eventName: String?) {
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
  }

  private fun emit(eventName: String, data: WritableMap) {
    Log.d(TAG, "emit $eventName")
    context
      .getJSModule(RCTDeviceEventEmitter::class.java)
      .emit(eventName, data)
  }

  private fun receive(eventName: String, payload: ReadableMap) {
    val requestId = payload.getString(PROP_REQUEST_ID)
    Log.d(TAG, "receive $eventName $requestId")
    val response = requestQueue.remove(requestId)
    if (response != null) {
      response(payload)
    } else {
      Log.e(TAG, "receive $eventName failed");
    }
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
