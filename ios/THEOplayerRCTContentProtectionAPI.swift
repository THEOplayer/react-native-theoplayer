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
    
    @objc(onBuildProcessed:)
    func onBuildProcessed(srcDict: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] onBuildProcessed.") }
    }
    
    @objc(onCertificateRequestProcessed:)
    func onCertificateRequestProcessed(srcDict: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] onCertificateRequestProcessed.") }
    }
    
    @objc(onCertificateResponseProcessed:)
    func onCertificateResponseProcessed(srcDict: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] onCertificateResponseProcessed.") }
    }
    
    @objc(onLicenseRequestProcessed:)
    func onLicenseRequestProcessed(srcDict: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] onLicenseRequestProcessed.") }
    }
    
    @objc(onLicenseResponseProcessed:)
    func onLicenseResponseProcessed(srcDict: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] onLicenseResponseProcessed.") }
    }
    
    @objc(onExtractFairplayContentIdProcessed:)
    func onExtractFairplayContentIdProcessed(srcDict: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] onExtractFairplayContentIdProcessed.") }
    }
}
