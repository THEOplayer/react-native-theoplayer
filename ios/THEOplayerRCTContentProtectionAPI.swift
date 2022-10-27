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

@objc(THEOplayerRCTContentProtectionAPI)
class THEOplayerRCTContentProtectionAPI: RCTEventEmitter {
    
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
    func handleBuildIntegration(integrationId: String, keySystemId: String, drmConfig: DRMConfiguration, completion:() -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] handleBuildIntegration.") }
    }
    
    func handleCertificateRequest(integrationId: String, keySystemId: String, certificateRequest: CertificateRequest, completion:() -> CertificateRequest?) {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] handleCertificateRequest.") }
    }
    
    func handleCertificateResponse(integrationId: String, keySystemId: String, certificateResponse: CertificateResponse, completion:() -> CertificateResponse?) {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] handleCertificateResponse.") }
    }
    
    func handleLicenseRequest(integrationId: String, keySystemId: String, licenseRequest: LicenseRequest, completion:() -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] handleLicenseRequest.") }
    }
    
    func handleLicenseResponse(integrationId: String, keySystemId: String, licenseResponse: LicenseResponse, completion:()->Void) {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] handleLicenseResponse.") }
    }
    
    func handleExtractFairplayContentId(integrationId: String, keySystemId: String, skdUrl: String, completion:()->Void) {
        if DEBUG_CONTENT_PROTECTION_API { print("[NATIVE] handleLicenseResponse.") }
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
