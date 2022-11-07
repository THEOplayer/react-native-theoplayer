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

let PROXY_INTEGRATION_TAG: String = "[ProxyContentProtectionIntegration]"

class THEOplayerRCTProxyContentProtectionIntegration: THEOplayerSDK.ContentProtectionIntegration {
    private weak var contentProtectionAPI: THEOplayerRCTContentProtectionAPI?
    private var integrationId: String!
    private var keySystemId: String!
    private var contentIdExtractionSemaphore = DispatchSemaphore(value: 0)
    
    init(contentProtectionAPI: THEOplayerRCTContentProtectionAPI?, integrationId: String, keySystemId: String, drmConfig: THEOplayerSDK.DRMConfiguration) {
        self.contentProtectionAPI = contentProtectionAPI
        self.integrationId = integrationId
        self.keySystemId = keySystemId
        self.contentProtectionAPI?.handleBuildIntegration(integrationId: integrationId, keySystemId: keySystemId, drmConfig: drmConfig, completion: { success in
            if success {
                print(PROXY_INTEGRATION_TAG, "Successfully created a THEOplayer ContentProtectionIntegration for \(integrationId) - \(keySystemId)")
            } else {
                print(PROXY_INTEGRATION_TAG, "WARNING: Failed to create a THEOplayer ContentProtectionIntegration for \(integrationId) - \(keySystemId)")
            }
        })
    }
    
    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        if DEBUG_CONTENT_PROTECTION_API { print(PROXY_INTEGRATION_TAG, "THEOplayer triggered an onCertificateRequest") }
        self.contentProtectionAPI?.handleCertificateRequest(integrationId: self.integrationId, keySystemId: self.keySystemId, certificateRequest: request) { certificateRequest, error in
            if let error = error {
                callback.error(error: error)
                return
            }
            if let request = certificateRequest {
                callback.request(request: request)
            } else {
                callback.error(error: ProxyIntegrationError.certificateRequestHandlingFailed)
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
        self.contentProtectionAPI?.handleLicenseRequest(integrationId: self.integrationId, keySystemId: self.keySystemId, licenseRequest: request) { licenseRequest, error in
            if let error = error {
                callback.error(error: error)
                return
            }
            if let request = licenseRequest {
                callback.request(request: request)
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
        _ = self.contentIdExtractionSemaphore.wait(timeout: .now() + 5.0)
        return extractedContentId
    }
}
