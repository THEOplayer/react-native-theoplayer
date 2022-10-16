package com.theoplayer.drm

import android.util.Log
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.theoplayer.android.api.contentprotection.*
import com.theoplayer.android.api.source.drm.DRMConfiguration

data class BridgeData(
  val requestId: String,
  val integrationId: String,
  val keySystemId: String
)

class ContentProtectionBridge : DeviceEventManagerModule.RCTDeviceEventEmitter {

  fun onBuild(integrationId: String, keySystemId: KeySystemId, config: DRMConfiguration?) {
    Log.d("ContentProtectionBridge", "onBuild")
    emit(
      "onBuildIntegrationRequest",
      BridgeData("testBuild", integrationId, KeySystemAdapter.toString(keySystemId))
    )
  }

  fun onCertificateRequest(request: Request, callback: CertificateRequestCallback) {
    emit("onCertificateRequest", null)
  }

  fun onCertificateResponse(response: Response, callback: CertificateResponseCallback) {
    emit("onCertificateResponse", null)
  }

  fun onLicenseRequest(request: Request?, callback: LicenseRequestCallback) {
    emit("onLicenseRequest", null)
  }

  fun onLicenseResponse(response: Response, callback: LicenseResponseCallback) {
    emit("onLicenseResponse", null)
  }

  override fun emit(eventName: String, data: Any?) {
    // TODO
  }
}
