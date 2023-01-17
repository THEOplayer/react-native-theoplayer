package com.theoplayer.drm

import com.theoplayer.android.api.contentprotection.*
import com.theoplayer.android.api.source.drm.DRMConfiguration

class ProxyContentProtectionIntegration(
  private val integrationId: String,
  private val keySystemId: KeySystemId,
  config: DRMConfiguration?,
  private val module: ContentProtectionModule
) : ContentProtectionIntegration() {

  init {
    module.onBuild(integrationId, keySystemId, config)
  }

  override fun onCertificateRequest(request: Request, callback: CertificateRequestCallback) {
    module.onCertificateRequest(integrationId, keySystemId, request, callback)
  }

  override fun onCertificateResponse(response: Response, callback: CertificateResponseCallback) {
    module.onCertificateResponse(integrationId, keySystemId, response, callback)
  }

  override fun onLicenseRequest(request: Request, callback: LicenseRequestCallback) {
    module.onLicenseRequest(integrationId, keySystemId, request, callback)
  }

  override fun onLicenseResponse(response: Response, callback: LicenseResponseCallback) {
    module.onLicenseResponse(integrationId, keySystemId, response, callback)
  }
}
