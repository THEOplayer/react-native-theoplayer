package com.theoplayer.drm

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegrationFactory
import com.theoplayer.android.api.contentprotection.KeySystemId
import com.theoplayer.android.api.source.drm.DRMConfiguration

class ProxyContentProtectionIntegrationFactory(
  private val integrationId: String,
  private val keySystemId: KeySystemId,
  private val module: ContentProtectionModule
) : ContentProtectionIntegrationFactory {

  override fun build(config: DRMConfiguration): ContentProtectionIntegration {
    return ProxyContentProtectionIntegration(integrationId, keySystemId, config, module)
  }
}
