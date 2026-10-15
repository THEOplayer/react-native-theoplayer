package com.theoplayer.drm

import com.theoplayer.android.api.contentprotection.*
import com.theoplayer.android.api.source.drm.DRMConfiguration
import java.util.UUID

class ProxyContentProtectionIntegration(
  private val integrationId: String,
  private val keySystemId: KeySystemId,
  config: DRMConfiguration?,
  private val module: ContentProtectionModule
) : ContentProtectionIntegration() {

  /**
   * Unique identifier for this integration instance, shared with the JavaScript
   * content protection registry to route callbacks to the matching integration.
   */
  val integrationInstanceId: String = UUID.randomUUID().toString()

  init {
    module.onBuild(integrationId, keySystemId, integrationInstanceId, config)
  }

  override fun onCertificateRequest(request: Request, callback: CertificateRequestCallback) {
    module.onCertificateRequest(integrationId, keySystemId, integrationInstanceId, request, callback)
  }

  override fun onCertificateResponse(response: Response, callback: CertificateResponseCallback) {
    module.onCertificateResponse(integrationId, keySystemId, integrationInstanceId, response, callback)
  }

  override fun onLicenseRequest(request: Request, callback: LicenseRequestCallback) {
    module.onLicenseRequest(integrationId, keySystemId, integrationInstanceId, request, callback)
  }

  override fun onLicenseResponse(response: Response, callback: LicenseResponseCallback) {
    module.onLicenseResponse(integrationId, keySystemId, integrationInstanceId, response, callback)
  }
}
