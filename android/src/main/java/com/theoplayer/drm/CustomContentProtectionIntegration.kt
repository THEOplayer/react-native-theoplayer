package com.theoplayer.drm

import com.theoplayer.android.api.contentprotection.*
import com.theoplayer.android.api.source.drm.DRMConfiguration

class CustomContentProtectionIntegration(
  private val integrationId: String,
  private val keySystemId: KeySystemId,
  config: DRMConfiguration?,
  private val bridge: ContentProtectionBridge
) :
  ContentProtectionIntegration() {

  init {
    bridge.onBuild(integrationId, keySystemId, config)
  }

  override fun onCertificateRequest(request: Request, callback: CertificateRequestCallback) {
    bridge.onCertificateRequest(request, callback)
  }

  override fun onCertificateResponse(response: Response, callback: CertificateResponseCallback) {
    bridge.onCertificateResponse(response, callback)
  }

  override fun onLicenseRequest(request: Request?, callback: LicenseRequestCallback) {
    bridge.onLicenseRequest(request, callback)
  }

  override fun onLicenseResponse(response: Response, callback: LicenseResponseCallback) {
    bridge.onLicenseResponse(response, callback)
  }
}
