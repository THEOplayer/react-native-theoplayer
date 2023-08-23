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

data class BridgeRequest(
  val onResult: HashMap<String, (result: ReadableMap) -> Unit>,
  val onError: (exception: THEOplayerException) -> Unit,
  val onTimeout: Runnable
)

private const val TAG = "ContentProtectionModule"

private const val EVENT_CERTIFICATE_REQUEST = "onCertificateRequest"
private const val EVENT_CERTIFICATE_REQUEST_PROCESSED_AS_REQUEST = "onCertificateRequestProcessedAsRequest"
private const val EVENT_CERTIFICATE_REQUEST_PROCESSED_AS_CERTIFICATE = "onCertificateRequestProcessedAsCertificate"
private const val EVENT_CERTIFICATE_RESPONSE = "onCertificateResponse"
private const val EVENT_CERTIFICATE_RESPONSE_PROCESSED = "onCertificateResponseProcessed"
private const val EVENT_BUILD_INTEGRATION = "onBuildIntegration"
private const val EVENT_BUILD_PROCESSED = "onBuildProcessed"
private const val EVENT_LICENSE_REQUEST = "onLicenseRequest"
private const val EVENT_LICENSE_REQUEST_PROCESSED_AS_REQUEST = "onLicenseRequestProcessedAsRequest"
private const val EVENT_LICENSE_REQUEST_PROCESSED_AS_LICENSE = "onLicenseRequestProcessedAsLicense"
private const val EVENT_LICENSE_RESPONSE = "onLicenseResponse"
private const val EVENT_LICENSE_RESPONSE_PROCESSED = "onLicenseResponseProcessed"

class ContentProtectionModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  companion object {
    const val REQUEST_TIMEOUT_MS = 10000L
  }

  private val handler = Handler(Looper.getMainLooper())

  private var requestId: Int = 0

  private val requestQueue: HashMap<String, BridgeRequest> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun registerContentProtectionIntegration(integrationId: String, keySystemIdStr: String) {
    val keySystemId = KeySystemAdapter.fromString(keySystemIdStr)
    if (keySystemId != null) {
      // We only support Widevine currently.
      if (keySystemId != KeySystemId.WIDEVINE) {
        return
      }
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
    receive(EVENT_BUILD_PROCESSED, payload)
  }

  @ReactMethod
  fun onCertificateRequestProcessedAsCertificate(payload: ReadableMap) {
    receive(EVENT_CERTIFICATE_REQUEST_PROCESSED_AS_CERTIFICATE, payload)
  }

  @ReactMethod
  fun onCertificateRequestProcessedAsRequest(payload: ReadableMap) {
    receive(EVENT_CERTIFICATE_REQUEST_PROCESSED_AS_REQUEST, payload)
  }

  @ReactMethod
  fun onCertificateResponseProcessed(payload: ReadableMap) {
    receive(EVENT_CERTIFICATE_RESPONSE_PROCESSED, payload)
  }

  @ReactMethod
  fun onLicenseRequestProcessedAsLicense(payload: ReadableMap) {
    receive(EVENT_LICENSE_REQUEST_PROCESSED_AS_LICENSE, payload)
  }

  @ReactMethod
  fun onLicenseRequestProcessedAsRequest(payload: ReadableMap) {
    receive(EVENT_LICENSE_REQUEST_PROCESSED_AS_REQUEST, payload)
  }

  @ReactMethod
  fun onLicenseResponseProcessed(payload: ReadableMap) {
    receive(EVENT_LICENSE_RESPONSE_PROCESSED, payload)
  }

  fun onBuild(integrationId: String, keySystemId: KeySystemId, config: DRMConfiguration?) {
    val payload = createBridgeData(integrationId, keySystemId)
    if (config != null) {
      payload.putMap(PROP_DRM_CONFIG, ContentProtectionAdapter.fromDRMConfiguration(config))
    }
    emit(
      EVENT_BUILD_INTEGRATION, payload,
      onResult = hashMapOf(EVENT_BUILD_PROCESSED to { /*NoOp*/ }),
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
    emit(
      EVENT_CERTIFICATE_REQUEST, payload,
      onResult = hashMapOf(
        // Pass modified request
        EVENT_CERTIFICATE_REQUEST_PROCESSED_AS_REQUEST to { result ->
          request.url = result.getString(PROP_URL)!!
          request.method = RequestMethodAdapter.fromString(result.getString(PROP_METHOD))
          val headers = result.getMap(PROP_HEADERS)?.toHashMap()?.mapValues { entry -> entry.value as? String }
          if (headers != null) {
            request.headers = headers
          }
          request.body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
          callback.request(request)
        },
        // Pass response
        EVENT_CERTIFICATE_REQUEST_PROCESSED_AS_CERTIFICATE to { result ->
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
    emit(
      EVENT_CERTIFICATE_RESPONSE, payload,
      onResult = hashMapOf(
        EVENT_CERTIFICATE_RESPONSE_PROCESSED to { result ->
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
    emit(
      EVENT_LICENSE_REQUEST, payload,
      onResult = hashMapOf(
        // Pass modified request
        EVENT_LICENSE_REQUEST_PROCESSED_AS_REQUEST to { result ->
          request.url = result.getString(PROP_URL)!!
          request.method = RequestMethodAdapter.fromString(result.getString(PROP_METHOD))
          val headers = result.getMap(PROP_HEADERS)?.toHashMap()?.mapValues { entry -> entry.value as? String }
          if (headers != null) {
            request.headers = headers
          }
          request.body = Base64.decode(result.getString(PROP_BASE64_BODY), Base64.DEFAULT)
          callback.request(request)
        },
        // Pass license response
        EVENT_LICENSE_REQUEST_PROCESSED_AS_LICENSE to { result ->
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
    emit(
      EVENT_LICENSE_RESPONSE, payload,
      onResult = hashMapOf(
        // Pass response
        EVENT_LICENSE_RESPONSE_PROCESSED to { result ->
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
          THEOplayerException(ErrorCode.CONTENT_PROTECTION_ERROR, "Unknown bridge event: $eventName.")
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
