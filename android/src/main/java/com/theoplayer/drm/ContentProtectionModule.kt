package com.theoplayer.drm

import android.os.Handler
import android.os.Looper
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.theoplayer.BuildConfig
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.contentprotection.*
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.drm.ContentProtectionAdapter.fromDRMConfiguration

const val TAG = "ContentProtectionModule"

data class BridgeRequest(
  val onResult: HashMap<String, (result: ReadableMap) -> Unit>,
  val onError: (exception: THEOplayerException) -> Unit,
  val onTimeout: Runnable
)

class ContentProtectionModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  companion object {
    const val REQUEST_TIMEOUT_MS = 10000L
  }

  private val handler = Handler(Looper.getMainLooper())

  private var requestId: Int = 0

  private val requestQueue: HashMap<String, BridgeRequest> = HashMap()

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
  fun onCertificateRequestProcessedAsCertificate(payload: ReadableMap) {
    receive("onCertificateRequestProcessedAsCertificate", payload)
  }

  @ReactMethod
  fun onCertificateRequestProcessedAsRequest(payload: ReadableMap) {
    receive("onCertificateRequestProcessedAsRequest", payload)
  }

  @ReactMethod
  fun onCertificateResponseProcessed(payload: ReadableMap) {
    receive("onCertificateResponseProcessed", payload)
  }

  @ReactMethod
  fun onLicenseRequestProcessedAsLicense(payload: ReadableMap) {
    receive("onLicenseRequestProcessedAsLicense", payload)
  }

  @ReactMethod
  fun onLicenseRequestProcessedAsRequest(payload: ReadableMap) {
    receive("onLicenseRequestProcessedAsRequest", payload)
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
    emit("onBuildIntegration", payload,
      onResult = hashMapOf(),
      onError = {}
    )
  }

  fun onCertificateRequest(
    integrationId: String,
    keySystemId: KeySystemId,
    request: Request,
    callback: CertificateRequestCallback
  ) {
    val payload = ContentProtectionAdapter.fromRequest(integrationId, keySystemId, request)
    emit("onCertificateRequest", payload,
      onResult = hashMapOf(
        // Pass modified request
        "onCertificateRequestProcessedAsRequest" to { result ->
          request.url = result.getString(PROP_URL)!!
          request.method = RequestMethodAdapter.fromString(result.getString(PROP_METHOD))
          request.headers = result.getMap(PROP_HEADERS)?.toHashMap() as HashMap<String, String>
          request.body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
          callback.request(request)
        },
        // Pass response
        "onCertificateRequestProcessedAsCertificate" to { result ->
          callback.respond(Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT))
        }
      ),
      onError = { error -> callback.error(error) }
    )
  }

  fun onCertificateResponse(
    integrationId: String,
    keySystemId: KeySystemId,
    response: Response,
    callback: CertificateResponseCallback
  ) {
    val payload = ContentProtectionAdapter.fromResponse(integrationId, keySystemId, response)
    emit("onCertificateResponse", payload,
      onResult = hashMapOf(
        "onCertificateResponseProcessed" to { result ->
          val body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
          callback.respond(body)
        },
      ),
      onError = { error -> callback.error(error) }
    )
  }

  fun onLicenseRequest(
    integrationId: String,
    keySystemId: KeySystemId,
    request: Request,
    callback: LicenseRequestCallback
  ) {
    val payload = ContentProtectionAdapter.fromRequest(integrationId, keySystemId, request)
    emit("onLicenseRequest", payload,
      onResult = hashMapOf(
        // Pass modified request
        "onLicenseRequestProcessedAsRequest" to { result ->
          request.url = result.getString(PROP_URL)!!
          request.method = RequestMethodAdapter.fromString(result.getString(PROP_METHOD))
          request.headers = result.getMap(PROP_HEADERS)?.toHashMap() as HashMap<String, String>
          request.body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
          callback.request(request)
        },
        // Pass license response
        "onLicenseRequestProcessedAsLicense" to { result ->
          callback.respond(Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT))
        }
      ),
      onError = { error -> callback.error(error) }
    )
  }

  fun onLicenseResponse(
    integrationId: String,
    keySystemId: KeySystemId,
    response: Response,
    callback: LicenseResponseCallback
  ) {
    val payload = ContentProtectionAdapter.fromResponse(integrationId, keySystemId, response)
    emit("onLicenseResponse", payload,
      onResult = hashMapOf(
        // Pass response
        "onLicenseResponseProcessed" to { result ->
          val body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
          callback.respond(body)
        }
      ),
      onError = { error -> callback.error(error) }
    )
  }

  @ReactMethod
  fun addListener(eventName: String?) {
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
  }

  private fun emit(
    eventName: String,
    payload: WritableMap,
    onResult: HashMap<String, (result: ReadableMap) -> Unit>,
    onError: (error: THEOplayerException) -> Unit
  ) {
    val requestId = createRequestId()
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "emit $eventName ($requestId)")
    }
    payload.putString(PROP_REQUEST_ID, requestId)
    val onTimeout = {
      onError(
        THEOplayerException(ErrorCode.CONTENT_PROTECTION_ERROR, "$eventName time-out.")
      )
    }
    requestQueue[requestId] = BridgeRequest(onResult, onError, onTimeout)
    handler.postDelayed(onTimeout, REQUEST_TIMEOUT_MS)
    context
      .getJSModule(RCTDeviceEventEmitter::class.java)
      .emit(eventName, payload)
  }

  private fun receive(eventName: String, payload: ReadableMap) {
    val requestId = payload.getString(PROP_REQUEST_ID)
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "receive $eventName ($requestId)")
    }
    val request = requestQueue.remove(requestId)
    if (request != null) {
      handler.removeCallbacks(request.onTimeout)
      val onEventResult = request.onResult[eventName]
      if (onEventResult != null) {
        onEventResult(payload)
      } else {
        request.onError(
          THEOplayerException(ErrorCode.CONTENT_PROTECTION_ERROR, "Unknown birdge event: $eventName.")
        )
      }
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
