//
//  THEOplayerRCTContentProtectionAPI.swift
//  Theoplayer
//
//  Created by William van Haevre on 09/09/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit
import THEOplayerSDK

let CPI_TAG: String = "[ContentProtectionIntegrtionAPI] "

@objc(THEOplayerRCTContentProtectionAPI)
class THEOplayerRCTContentProtectionAPI: RCTEventEmitter {
    
    private var buildIntegrationCompletions: [String:() -> Void] = [:]
    private var certificateRequestCompletions: [String:(CertificateRequest?) -> Void] = [:]
    private var certificateResponseCompletions: [String:(CertificateResponse?) -> Void] = [:]
    private var licenseRequestCompletions: [String:(LicenseRequest?) -> Void] = [:]
    private var licenseResponseCompletions: [String:(LicenseResponse?) -> Void] = [:]
    private var extractedFairplayContentIdCompletions: [String:(String?) -> Void] = [:]
    
    override static func moduleName() -> String! {
        return "ContentProtectionModule"
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override func supportedEvents() -> [String]! {
        return ["onBuildIntegrationRequest",
                "onCertificateRequest",
                "onCertificateResponse",
                "onLicenseRequest",
                "onLicenseResponse",
                "onExtractFairplayContentId"
        ]
    }
    
    // MARK: Module actions
    func handleBuildIntegration(integrationId: String, keySystemId: String, drmConfig: DRMConfiguration, completion: @escaping () -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleBuildIntegration.") }
        let requestId = UUID().uuidString
        self.buildIntegrationCompletions[requestId] = completion
        self.sendEvent(withName: "onBuildIntegrationRequest", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
        ])
    }
    
    func handleCertificateRequest(integrationId: String, keySystemId: String, certificateRequest: CertificateRequest, completion: @escaping (CertificateRequest?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleCertificateRequest.") }
        let requestId = UUID().uuidString
        self.certificateRequestCompletions[requestId] = completion
        self.sendEvent(withName: "onBuildIntegrationRequest", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
        ])
    }
    
    func handleCertificateResponse(integrationId: String, keySystemId: String, certificateResponse: CertificateResponse, completion: @escaping (CertificateResponse?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleCertificateResponse.") }
        let requestId = UUID().uuidString
        self.certificateResponseCompletions[requestId] = completion
        self.sendEvent(withName: "onBuildIntegrationRequest", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
        ])
    }
    
    func handleLicenseRequest(integrationId: String, keySystemId: String, licenseRequest: LicenseRequest, completion: @escaping (LicenseRequest?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleLicenseRequest.") }
        let requestId = UUID().uuidString
        self.licenseRequestCompletions[requestId] = completion
        self.sendEvent(withName: "onBuildIntegrationRequest", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
        ])
    }
    
    func handleLicenseResponse(integrationId: String, keySystemId: String, licenseResponse: LicenseResponse, completion: @escaping (LicenseResponse?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleLicenseResponse.") }
        let requestId = UUID().uuidString
        self.licenseResponseCompletions[requestId] = completion
        self.sendEvent(withName: "onBuildIntegrationRequest", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
        ])
    }
    
    func handleExtractFairplayContentId(integrationId: String, keySystemId: String, skdUrl: String, completion: @escaping (String?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleLicenseResponse.") }
        let requestId = UUID().uuidString
        self.extractedFairplayContentIdCompletions[requestId] = completion
        self.sendEvent(withName: "onBuildIntegrationRequest", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
        ])
    }
    
    // MARK: Incoming JS Notifications
    @objc(registerContentProtectionIntegration:keySystemId:)
    func registerContentProtectionIntegration(integrationId: String, keySystemId: String) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "registerContentProtectionIntegration for \(integrationId) - \(keySystemId)") }
    }
    
    @objc(onBuildProcessed:)
    func onBuildProcessed(result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] onBuildProcessed.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.buildIntegrationCompletions.removeValue(forKey: requestId) {
            completion()
        }
    }
    
    @objc(onCertificateRequestProcessed:)
    func onCertificateRequestProcessed(result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateRequestProcessed.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.certificateRequestCompletions.removeValue(forKey: requestId) {
            let certificateRequest = CertificateRequest(url: "", method: "", headers: [:], body: nil)
            completion(certificateRequest)
        }
    }
    
    @objc(onCertificateResponseProcessed:)
    func onCertificateResponseProcessed(result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateResponseProcessed.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.certificateResponseCompletions.removeValue(forKey: requestId) {
            let certificateRequest = CertificateRequest(url: "", method: "", headers: [:], body: nil)
            let certificateResponse = CertificateResponse(certificateRequest: certificateRequest, url: "", status: 200, statusText: "", headers: [:], body: Data())
            completion(certificateResponse)
        }
    }
    
    @objc(onLicenseRequestProcessed:)
    func onLicenseRequestProcessed(result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseRequestProcessed.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.licenseRequestCompletions.removeValue(forKey: requestId) {
            let licenseRequest = LicenseRequest(url: "", method: "", headers: [:], body: nil)
            completion(licenseRequest)
        }
    }
    
    @objc(onLicenseResponseProcessed:)
    func onLicenseResponseProcessed(result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseResponseProcessed.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.licenseResponseCompletions.removeValue(forKey: requestId) {
            let licenseRequest = LicenseRequest(url: "", method: "", headers: [:], body: nil)
            let licenseResponse = LicenseResponse(licenseRequest: licenseRequest, url: "", status: 200, statusText: "", headers: [:], body: Data())
            completion(licenseResponse)
        }
    }
    
    @objc(onExtractFairplayContentIdProcessed:)
    func onExtractFairplayContentIdProcessed(result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onExtractFairplayContentIdProcessed.") }
        if let requestId = result["requestId"] as? String,
           let contentId = result["contentId"] as? String,
           let completion = self.extractedFairplayContentIdCompletions.removeValue(forKey: requestId) {
            completion(contentId)
        }
    }
}
