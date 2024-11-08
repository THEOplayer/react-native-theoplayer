package com.theoplayer.specs

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap

abstract class ContentProtectionModuleSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun registerContentProtectionIntegration(integrationId: String, keySystemIdStr: String)

  abstract fun onBuildProcessed(payload: ReadableMap)

  abstract fun onCertificateRequest(payload: ReadableMap?)

  abstract fun onCertificateRequestProcessedAsCertificate(payload: ReadableMap)

  abstract fun onCertificateRequestProcessedAsRequest(payload: ReadableMap)

  abstract fun onCertificateResponseProcessed(payload: ReadableMap)

  abstract fun onLicenseRequestProcessedAsLicense(payload: ReadableMap)

  abstract fun onLicenseRequestProcessedAsRequest(payload: ReadableMap)

  abstract fun onLicenseResponseProcessed(payload: ReadableMap)

  abstract fun onExtractFairplayContentIdProcessed(payload: ReadableMap?)
}
