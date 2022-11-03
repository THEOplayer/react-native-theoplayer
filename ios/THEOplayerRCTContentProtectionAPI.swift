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

let CPI_TAG: String = "[ContentProtectionIntegrationAPI] "

@objc(THEOplayerRCTContentProtectionAPI)
class THEOplayerRCTContentProtectionAPI: RCTEventEmitter {
    
    private var buildIntegrationCompletions: [String:(Bool) -> Void] = [:]
    private var certificateRequestCompletions: [String:(Data?, Error?) -> Void] = [:]
    private var certificateResponseCompletions: [String:(Data?, Error?) -> Void] = [:]
    private var licenseRequestCompletions: [String:(Data?, Error?) -> Void] = [:]
    private var licenseResponseCompletions: [String:(Data?, Error?) -> Void] = [:]
    private var extractedFairplayContentIds: [String:String] = [:]                          // [skdUrl : contentId]
    
    override static func moduleName() -> String! {
        return "ContentProtectionModule"
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override func supportedEvents() -> [String]! {
        return ["onBuildIntegration",
                "onCertificateRequest",
                "onCertificateResponse",
                "onLicenseRequest",
                "onLicenseResponse",
                "onExtractFairplayContentId"
        ]
    }
    
    // MARK: Module actions
    func handleBuildIntegration(integrationId: String, keySystemId: String, drmConfig: DRMConfiguration, completion: @escaping (Bool) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleBuildIntegration.") }
        let requestId = UUID().uuidString
        self.buildIntegrationCompletions[requestId] = completion
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
        ])
    }
    
    func handleCertificateRequest(integrationId: String, keySystemId: String, certificateRequest: CertificateRequest, completion: @escaping (Data?, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleCertificateRequest.") }
        let requestId = UUID().uuidString
        self.certificateRequestCompletions[requestId] = completion
        self.sendEvent(withName: "onCertificateRequest", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
            // TODO: aggregate request
        ])
    }
    
    func handleCertificateResponse(integrationId: String, keySystemId: String, certificateResponse: CertificateResponse, completion: @escaping (Data?, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleCertificateResponse.") }
        let requestId = UUID().uuidString
        self.certificateResponseCompletions[requestId] = completion
        self.sendEvent(withName: "onCertificateResponse", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
            // TODO: aggregate response
        ])
    }
    
    func handleLicenseRequest(integrationId: String, keySystemId: String, licenseRequest: LicenseRequest, completion: @escaping (Data?, Error?) -> Void) {
        // prefetch contentId for Fairplay asynchronously
        if let skdUrl = licenseRequest.fairplaySkdUrl {
            if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "prefetch Fairplay contentId.") }
            self.sendEvent(withName: "onExtractFairplayContentId", body: [
                integrationId: integrationId,
                keySystemId: keySystemId,
                skdUrl: skdUrl
            ])
        }
        
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleLicenseRequest.") }
        let requestId = UUID().uuidString
        self.licenseRequestCompletions[requestId] = completion
        self.sendEvent(withName: "onLicenseRequest", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
            // TODO: aggregate request
        ])
    }
    
    func handleLicenseResponse(integrationId: String, keySystemId: String, licenseResponse: LicenseResponse, completion: @escaping (Data?, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleLicenseResponse.") }
        let requestId = UUID().uuidString
        self.licenseResponseCompletions[requestId] = completion
        self.sendEvent(withName: "onLicenseResponse", body: [
            requestId: requestId,
            integrationId: integrationId,
            keySystemId: keySystemId
            // TODO: aggregate response
        ])
    }
    
    func handleExtractFairplayContentId(integrationId: String, keySystemId: String, skdUrl: String) -> String {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleExtractFairplayContentId.") }
        return self.extractedFairplayContentIds[skdUrl] ?? skdUrl
    }
    
    // MARK: Incoming JS Notifications
    @objc(registerContentProtectionIntegration:keySystemId:)
    func registerContentProtectionIntegration(_ integrationId: String, keySystemId: String) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "registerContentProtectionIntegration for \(integrationId) - \(keySystemId)") }
        // Create a proxy factory
        let integrationFactory = THEOplayerRCTProxyContentProtectionIntegrationFactory(contentProtectionAPI: self,
                                                                                       integrationId: integrationId,
                                                                                       keySystemId: keySystemId)
        // Register that factory on the THEOplayerSDK:
        let keySystem = self.keySystemFromString(keySystemId)
        THEOplayerSDK.THEOplayer.registerContentProtectionIntegration(integrationId: integrationId,
                                                                      keySystem: keySystem,
                                                                      integrationFactory: integrationFactory)
    }
    
    @objc(onBuildProcessed:)
    func onBuildProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] onBuildProcessed.") }
        if let requestId = result["requestId"] as? String,
           let resultString = result["resultString"] as? String,
           let completion = self.buildIntegrationCompletions.removeValue(forKey: requestId) {
            completion(resultString == "success")
        } else {
            // TODO: handle issues
        }
    }
    
    @objc(onCertificateRequestProcessed:)
    func onCertificateRequestProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateRequestProcessed.") }
        if let requestId = result["requestId"] as? String,
           let certificateDataBase64String = result["resultString"] as? String,
           let completion = self.certificateRequestCompletions.removeValue(forKey: requestId) {
            let certificateData = Data(base64Encoded: certificateDataBase64String)
            completion(certificateData, nil)
        } else {
            // TODO: handle issues
        }
    }
    
    @objc(onCertificateResponseProcessed:)
    func onCertificateResponseProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateResponseProcessed.") }
        if let requestId = result["requestId"] as? String,
           let certificateDataBase64String = result["resultString"] as? String,
           let completion = self.certificateResponseCompletions.removeValue(forKey: requestId) {
            let certificateData = Data(base64Encoded: certificateDataBase64String)
            completion(certificateData, nil)
        } else {
            // TODO: handle issues
        }
    }
    
    @objc(onLicenseRequestProcessed:)
    func onLicenseRequestProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseRequestProcessed.") }
        if let requestId = result["requestId"] as? String,
           let licenseDataBase64String = result["resultString"] as? String,
           let completion = self.licenseRequestCompletions.removeValue(forKey: requestId) {
            let licenseData = Data(base64Encoded: licenseDataBase64String)
            completion(licenseData, nil)
        } else {
            // TODO: handle issues
        }
    }
    
    @objc(onLicenseResponseProcessed:)
    func onLicenseResponseProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseResponseProcessed.") }
        if let requestId = result["requestId"] as? String,
           let licenseDataBase64String = result["resultString"] as? String,
           let completion = self.licenseResponseCompletions.removeValue(forKey: requestId) {
            let licenseData = Data(base64Encoded: licenseDataBase64String)
            completion(licenseData, nil)
        } else {
            // TODO: handle issues
        }
    }
    
    @objc(onExtractFairplayContentIdProcessed:)
    func onExtractFairplayContentIdProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onExtractFairplayContentIdProcessed.") }
        if let skdUrl = result["skdUrl"] as? String,
           let contentId = result["contentId"] as? String {
            self.extractedFairplayContentIds[skdUrl] = contentId
        } else {
            // TODO: handle issues
        }
    }
    
    // MARK: Helpers
    private func keySystemFromString(_ keySystemIdString: String) -> THEOplayerSDK.KeySystemId {
        switch keySystemIdString.lowercased() {
        case "fairplay":
            return .FAIRPLAY
        case "widevine":
            return .WIDEVINE
        case "playready":
            return .PLAYREADY
        default:
            return .FAIRPLAY // fallback to fairplay on iOS...
        }
    }
}
