//
//  THEOplayerRCTContentProtectionIntegration.swift
//  Theoplayer
//
//  Created by William van Haevre on 28/10/2022.
//

import Foundation
import THEOplayerSDK

enum ProxyIntegrationError: Error {
    case certificateRequestHandlingFailed
    case certificateResponseHandlingFailed
    case licenseRequestHandlingFailed
    case licenseResponseHandlingFailed
    case extractFairplayContentIdFailed
}

let CERTIFICATE_MARKER: String = "https://certificatemarker/"
let PROXY_INTEGRATION_TAG: String = "[ProxyContentProtectionIntegration]"
let BRIDGE_TIMEOUT = 10.0

class THEOplayerRCTProxyContentProtectionIntegration: THEOplayerSDK.ContentProtectionIntegration {
    private weak var contentProtectionAPI: THEOplayerRCTContentProtectionAPI?
    private var integrationId: String!
    private var keySystemId: String!
    private var buildIntegrationSemaphore = DispatchSemaphore(value: 0)
    private var contentIdExtractionSemaphore = DispatchSemaphore(value: 0)
    private var drmConfig: THEOplayerSDK.DRMConfiguration
    
    init(contentProtectionAPI: THEOplayerRCTContentProtectionAPI?, integrationId: String, keySystemId: String, drmConfig: THEOplayerSDK.DRMConfiguration) {
        self.contentProtectionAPI = contentProtectionAPI
        self.integrationId = integrationId
        self.keySystemId = keySystemId
        self.drmConfig = drmConfig
        self.contentProtectionAPI?.handleBuildIntegration(integrationId: integrationId, keySystemId: keySystemId, drmConfig: drmConfig, completion: { success in
            if success {
                print(PROXY_INTEGRATION_TAG, "Successfully created a THEOplayer ContentProtectionIntegration for \(integrationId) - \(keySystemId)")
            } else {
                print(PROXY_INTEGRATION_TAG, "WARNING: Failed to create a THEOplayer ContentProtectionIntegration for \(integrationId) - \(keySystemId)")
            }
            self.buildIntegrationSemaphore.signal()
        })
        _ = self.buildIntegrationSemaphore.wait(timeout: .now() + BRIDGE_TIMEOUT)
    }
    
    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "THEOplayer triggered an onCertificateRequest") }
        let processedLocally = self.handleCertificateRequestLocally(drmConfig: drmConfig, callback: callback)
        if !processedLocally {
            if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "Handling certificate request through content protection integration.") }
            self.contentProtectionAPI?.handleCertificateRequest(integrationId: self.integrationId, keySystemId: self.keySystemId, certificateRequest: request) { certificateData, error in
                if let error = error {
                    callback.error(error: error)
                    return
                }
                if let data = certificateData {
                    callback.respond(certificate: data)
                } else {
                    callback.error(error: ProxyIntegrationError.certificateRequestHandlingFailed)
                }
            }
        }
    }
    
    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "THEOplayer triggered an onCertificateResponse") }
        self.contentProtectionAPI?.handleCertificateResponse(integrationId: self.integrationId, keySystemId: self.keySystemId, certificateResponse: response) { certificateData, error in
            if let error = error {
                callback.error(error: error)
                return
            }
            if let data = certificateData {
                callback.respond(certificate: data)
            } else {
                callback.error(error: ProxyIntegrationError.certificateResponseHandlingFailed)
            }
        }
    }
    
    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "THEOplayer triggered an onLicenseRequest") }
        self.contentProtectionAPI?.handleLicenseRequest(integrationId: self.integrationId, keySystemId: self.keySystemId, licenseRequest: request) { licenseData, error in
            if let error = error {
                callback.error(error: error)
                return
            }
            if let data = licenseData {
                callback.respond(license: data)
            } else {
                callback.error(error: ProxyIntegrationError.licenseRequestHandlingFailed)
            }
        }
    }
    
    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "THEOplayer triggered an onLicenseResponse") }
        self.contentProtectionAPI?.handleLicenseResponse(integrationId: self.integrationId, keySystemId: self.keySystemId, licenseResponse: response) { licenseData, error in
            if let error = error {
                callback.error(error: error)
                return
            }
            if let data = licenseData {
                callback.respond(license: data)
            } else {
                callback.error(error: ProxyIntegrationError.licenseResponseHandlingFailed)
            }
        }
    }
    
    func extractFairplayContentId(skdUrl: String) -> String {
        if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "THEOplayer triggered an extractFairplayContentId") }
        var extractedContentId = skdUrl
        self.contentProtectionAPI?.handleExtractFairplayContentId(integrationId: self.integrationId, keySystemId: self.keySystemId, skdUrl: skdUrl) { contentId, error in
            if let error = error {
                extractedContentId = skdUrl
                print(PROXY_INTEGRATION_TAG, "We encountered an issue while extracting the fairplay contentId: \(error.localizedDescription)")
                self.contentIdExtractionSemaphore.signal()
                return
            }
            extractedContentId = contentId
            if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "Received extracted fairplay contentId \(extractedContentId) on RN bridge") }
            self.contentIdExtractionSemaphore.signal()
        }
        // TODO: make extractFairplayContentId async on THEOplayer SDK
        // FOR NOW: We temporarily block (topped to max 5 sec) the flow to retrieve the extracted contentId asynchronously.
        _ = self.contentIdExtractionSemaphore.wait(timeout: .now() + BRIDGE_TIMEOUT)
        return extractedContentId
    }
    
    // MARK: local certificate handling
    private func handleCertificateRequestLocally(drmConfig: THEOplayerSDK.DRMConfiguration, callback: CertificateRequestCallback) -> Bool {
        if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "Checking for certificate in drmConfiguration...") }
        var fairplayConfig: THEOplayerSDK.KeySystemConfiguration?
        if let multiDrmConfigCollection = drmConfig as? THEOplayerSDK.MultiplatformDRMConfiguration {
            let keySystemConfigurations: THEOplayerSDK.KeySystemConfigurationCollection = multiDrmConfigCollection.keySystemConfigurations
            fairplayConfig = keySystemConfigurations.fairplay
        } else if let fairplayDrmConfig = drmConfig as? THEOplayerSDK.FairPlayDRMConfiguration {
            fairplayConfig = fairplayDrmConfig.fairplay
        }

        if let fairplay = fairplayConfig,
           let certificateUrl = fairplay.certificateURL?.absoluteString,
           certificateUrl.hasPrefix(CERTIFICATE_MARKER) {
            let certificateBase64 = String(certificateUrl.suffix(from: CERTIFICATE_MARKER.endIndex))
            if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "Using provided base64 certificate: \(certificateBase64)") }
            if let certificateData = Data(base64Encoded: certificateBase64, options: .ignoreUnknownCharacters) {
                callback.respond(certificate: certificateData)
                return true
            }
        }
        
        return false
    }
}
