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

let PROXY_INTEGRATION_TAG: String = "[ProxyContentProtectionIntegration] "

class THEOplayerRCTProxyContentProtectionIntegration: THEOplayerSDK.ContentProtectionIntegration {
    private weak var contentProtectionAPI: THEOplayerRCTContentProtectionAPI?
    private var integrationId: String!
    private var keySystemId: String!
    
    init(contentProtectionAPI: THEOplayerRCTContentProtectionAPI?, integrationId: String, keySystemId: String, drmConfig: THEOplayerSDK.DRMConfiguration) {
        self.contentProtectionAPI = contentProtectionAPI
        self.integrationId = integrationId
        self.keySystemId = keySystemId
        self.contentProtectionAPI?.handleBuildIntegration(integrationId: integrationId, keySystemId: keySystemId, drmConfig: drmConfig, completion: { success in
            if success {
                print("Successfully created a THEOplayer ContentProtectionIntegration for \(integrationId) - \(keySystemId)")
            } else {
                print("WARNING: Failed to create a THEOplayer ContentProtectionIntegration for \(integrationId) - \(keySystemId)")
            }
        })
    }
    
    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        self.contentProtectionAPI?.handleCertificateRequest(integrationId: self.integrationId, keySystemId: self.keySystemId, certificateRequest: request) { data, error in
            if let error = error {
                callback.error(error: error)
                return
            }
            if let responseData = data {
                callback.respond(certificate: responseData)
            } else {
                callback.error(error: ProxyIntegrationError.certificateRequestHandlingFailed)
            }
        }
    }
    
    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        self.contentProtectionAPI?.handleCertificateResponse(integrationId: self.integrationId, keySystemId: self.keySystemId, certificateResponse: response) { data, error in
            if let error = error {
                callback.error(error: error)
                return
            }
            if let responseData = data {
                callback.respond(certificate: responseData)
            } else {
                callback.error(error: ProxyIntegrationError.certificateResponseHandlingFailed)
            }
        }
    }
    
    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        self.contentProtectionAPI?.handleLicenseRequest(integrationId: self.integrationId, keySystemId: self.keySystemId, licenseRequest: request) { data, error in
            if let error = error {
                callback.error(error: error)
                return
            }
            if let responseData = data {
                callback.respond(license: responseData)
            } else {
                callback.error(error: ProxyIntegrationError.licenseRequestHandlingFailed)
            }
        }
    }
    
    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        self.contentProtectionAPI?.handleLicenseResponse(integrationId: self.integrationId, keySystemId: self.keySystemId, licenseResponse: response) { data, error in
            if let error = error {
                callback.error(error: error)
                return
            }
            if let responseData = data {
                callback.respond(license: responseData)
            } else {
                callback.error(error: ProxyIntegrationError.licenseResponseHandlingFailed)
            }
        }
    }
    
    func extractFairplayContentId(skdUrl: String) -> String {
        return self.contentProtectionAPI?.handleExtractFairplayContentId(integrationId: self.integrationId, keySystemId: self.keySystemId, skdUrl: skdUrl) ?? skdUrl
    }
}
