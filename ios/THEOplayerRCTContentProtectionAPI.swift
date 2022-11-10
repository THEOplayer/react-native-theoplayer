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

let CPI_EVENT_PROP_REQUEST_ID: String = "requestId"
let CPI_EVENT_PROP_INTEGRATION_ID: String = "integrationId"
let CPI_EVENT_PROP_KEYSYSTEM_ID: String = "keySystemId"
let CPI_EVENT_PROP_DRM_CONFIG: String = "drmConfig"
let CPI_EVENT_PROP_FAIRPLAY_SKD_URL: String = "fairplaySkdUrl"

let CPI_TAG: String = "[ContentProtectionIntegrationAPI]"
let BRIDGE_REQUEST_TIMEOUT = 10.0

@objc(THEOplayerRCTContentProtectionAPI)
class THEOplayerRCTContentProtectionAPI: RCTEventEmitter {
    
    private var buildIntegrationCompletions: [String:(Bool) -> Void] = [:]                              // [requestId : completion]
    private var certificateRequestCompletions: [String:(CertificateRequest?, Error?) -> Void] = [:]     // [requestId : completion]
    private var certificateResponseCompletions: [String:(Data?, Error?) -> Void] = [:]                  // [requestId : completion]
    private var licenseRequestCompletions: [String:(LicenseRequest?, Error?) -> Void] = [:]             // [requestId : completion]
    private var licenseResponseCompletions: [String:(Data?, Error?) -> Void] = [:]                      // [requestId : completion]
    private var extractFairplayCompletions: [String:(String, Error?) -> Void] = [:]                     // [requestId : completion]
    private var requestTimers: [String:Timer] = [:]                                                     // [requestId : Timer]
    
    
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
    
    private func invalidateRequestWithId(_ requestId: String) {
        if let timer = self.requestTimers[requestId] {
            timer.invalidate()
            self.requestTimers.removeValue(forKey: requestId)
        }
    }
    
    private func timeoutRequestWithId(_ requestId: String) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "Timeout reached: removing completion for request with Id \(requestId)") }
        self.invalidateRequestWithId(requestId)
    }
    
    // MARK: Module actions
    func handleBuildIntegration(integrationId: String, keySystemId: String, drmConfig: DRMConfiguration, completion: @escaping (Bool) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleBuildIntegration.") }
        let requestId = UUID().uuidString
        self.buildIntegrationCompletions[requestId] = completion
        self.sendEvent(withName: "onBuildIntegration",
                       body: THEOplayerRCTContentProtectionAggregator.aggregateDrmConfiguration(integrationId: integrationId,
                                                                                                keySystemId: keySystemId,
                                                                                                requestId: requestId,
                                                                                                drmConfig: drmConfig))
        self.requestTimers[requestId] = Timer.scheduledTimer(withTimeInterval: BRIDGE_REQUEST_TIMEOUT, repeats: false, block: { t in
            self.timeoutRequestWithId(requestId)
            self.buildIntegrationCompletions.removeValue(forKey: requestId)
        })
    }
    
    func handleCertificateRequest(integrationId: String, keySystemId: String, certificateRequest: CertificateRequest, completion: @escaping (CertificateRequest?, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleCertificateRequest.") }
        let requestId = UUID().uuidString
        self.certificateRequestCompletions[requestId] = completion
        self.sendEvent(withName: "onCertificateRequest",
                       body: THEOplayerRCTContentProtectionAggregator.aggregateCertificateRequest(integrationId: integrationId,
                                                                                                  keySystemId: keySystemId,
                                                                                                  requestId: requestId,
                                                                                                  certificateRequest: certificateRequest))
        self.requestTimers[requestId] = Timer.scheduledTimer(withTimeInterval: BRIDGE_REQUEST_TIMEOUT, repeats: false, block: { t in
            self.timeoutRequestWithId(requestId)
            self.certificateRequestCompletions.removeValue(forKey: requestId)
        })
    }
    
    func handleCertificateResponse(integrationId: String, keySystemId: String, certificateResponse: CertificateResponse, completion: @escaping (Data?, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleCertificateResponse.") }
        let requestId = UUID().uuidString
        self.certificateResponseCompletions[requestId] = completion
        self.sendEvent(withName: "onCertificateResponse",
                       body: THEOplayerRCTContentProtectionAggregator.aggregateCertificateResponse(integrationId: integrationId,
                                                                                                   keySystemId: keySystemId,
                                                                                                   requestId: requestId,
                                                                                                   certificateResponse: certificateResponse))
        self.requestTimers[requestId] = Timer.scheduledTimer(withTimeInterval: BRIDGE_REQUEST_TIMEOUT, repeats: false, block: { t in
            self.timeoutRequestWithId(requestId)
            self.certificateResponseCompletions.removeValue(forKey: requestId)
        })
    }
    
    func handleLicenseRequest(integrationId: String, keySystemId: String, licenseRequest: LicenseRequest, completion: @escaping (LicenseRequest?, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleLicenseRequest.") }
        let requestId = UUID().uuidString
        self.licenseRequestCompletions[requestId] = completion
        self.sendEvent(withName: "onLicenseRequest",
                       body: THEOplayerRCTContentProtectionAggregator.aggregateLicenseRequest(integrationId: integrationId,
                                                                                              keySystemId: keySystemId,
                                                                                              requestId: requestId,
                                                                                              licenseRequest: licenseRequest))
        self.requestTimers[requestId] = Timer.scheduledTimer(withTimeInterval: BRIDGE_REQUEST_TIMEOUT, repeats: false, block: { t in
            self.timeoutRequestWithId(requestId)
            self.licenseRequestCompletions.removeValue(forKey: requestId)
        })
    }
    
    func handleLicenseResponse(integrationId: String, keySystemId: String, licenseResponse: LicenseResponse, completion: @escaping (Data?, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleLicenseResponse.") }
        let requestId = UUID().uuidString
        self.licenseResponseCompletions[requestId] = completion
        self.sendEvent(withName: "onLicenseResponse",
                       body: THEOplayerRCTContentProtectionAggregator.aggregateLicenseResponse(integrationId: integrationId,
                                                                                               keySystemId: keySystemId,
                                                                                               requestId: requestId,
                                                                                               licenseResponse: licenseResponse))
        self.requestTimers[requestId] = Timer.scheduledTimer(withTimeInterval: BRIDGE_REQUEST_TIMEOUT, repeats: false, block: { t in
            self.timeoutRequestWithId(requestId)
            self.licenseResponseCompletions.removeValue(forKey: requestId)
        })
    }
    
    func handleExtractFairplayContentId(integrationId: String, keySystemId: String, skdUrl: String, completion: @escaping (String, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleExtractFairplayContentId.") }
        let requestId = UUID().uuidString
        self.extractFairplayCompletions[requestId] = completion
        self.sendEvent(withName: "onExtractFairplayContentId", body: [
            CPI_EVENT_PROP_INTEGRATION_ID: integrationId,
            CPI_EVENT_PROP_KEYSYSTEM_ID: keySystemId,
            CPI_EVENT_PROP_REQUEST_ID: requestId,
            CPI_EVENT_PROP_FAIRPLAY_SKD_URL: skdUrl
        ])
        self.requestTimers[requestId] = Timer.scheduledTimer(withTimeInterval: BRIDGE_REQUEST_TIMEOUT, repeats: false, block: { t in
            self.timeoutRequestWithId(requestId)
            self.extractFairplayCompletions.removeValue(forKey: requestId)
        })
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
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onBuildProcessed.") }
        if let requestId = result["requestId"] as? String,
           let resultString = result["resultString"] as? String,
           let completion = self.buildIntegrationCompletions.removeValue(forKey: requestId) {
            self.invalidateRequestWithId(requestId)
            completion(resultString == "success")
        } else {
            print(CPI_TAG, "Failed to process buildIntegration result")
        }
    }
    
    @objc(onCertificateRequestProcessed:)
    func onCertificateRequestProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateRequestProcessed.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.certificateRequestCompletions.removeValue(forKey: requestId),
           let url = result["url"] as? String,
           let method = result["method"] as? String,
           let headers = result["headers"] as? [String:String] {
            var bodyData: Data?
            if let base64body = result["base64body"] as? String {
                bodyData = Data(base64Encoded: base64body, options: .ignoreUnknownCharacters)
            }
            let certificateRequest = CertificateRequest(url: url,
                                                        method: method,
                                                        headers: headers,
                                                        body: bodyData)
            self.invalidateRequestWithId(requestId)
            completion(certificateRequest, nil)
        } else {
            print(CPI_TAG, "Failed to process certificateResult result")
        }
    }
    
    @objc(onCertificateResponseProcessed:)
    func onCertificateResponseProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateResponseProcessed.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.certificateResponseCompletions.removeValue(forKey: requestId) {
            var bodyData = Data()
            if let base64body = result["base64body"] as? String {
                bodyData = Data(base64Encoded: base64body, options: .ignoreUnknownCharacters) ?? Data()
            }
            self.invalidateRequestWithId(requestId)
            completion(bodyData, nil)
        } else {
            print(CPI_TAG, "Failed to process certificateResponse result")
        }
    }
    
    @objc(onLicenseRequestProcessed:)
    func onLicenseRequestProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseRequestProcessed.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.licenseRequestCompletions.removeValue(forKey: requestId),
           let url = result["url"] as? String,
           let method = result["method"] as? String,
           let headers = result["headers"] as? [String:String] {
            var bodyData: Data?
            if let base64body = result["base64body"] as? String {
                bodyData = Data(base64Encoded: base64body, options: .ignoreUnknownCharacters)
            }
            let fairplaySkdUrl = result["fairplaySkdUrl"] as? String
            let licenseRequest = LicenseRequest(url: url,
                                                method: method,
                                                headers: headers,
                                                body: bodyData,
                                                fairplaySkdUrl: fairplaySkdUrl,
                                                useCredentials: false)
            self.invalidateRequestWithId(requestId)
            completion(licenseRequest, nil)
        } else {
            print(CPI_TAG, "Failed to process licenseRequest result")
        }
    }
    
    @objc(onLicenseResponseProcessed:)
    func onLicenseResponseProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseResponseProcessed.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.licenseResponseCompletions.removeValue(forKey: requestId) {
            var bodyData = Data()
            if let base64body = result["base64body"] as? String {
                bodyData = Data(base64Encoded: base64body, options: .ignoreUnknownCharacters) ?? Data()
            }
            self.invalidateRequestWithId(requestId)
            completion(bodyData, nil)
        } else {
            print(CPI_TAG, "Failed to process licenseResponse result")
        }
    }
    
    @objc(onExtractFairplayContentIdProcessed:)
    func onExtractFairplayContentIdProcessed(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onExtractFairplayContentIdProcessed.") }
        if let requestId = result["requestId"] as? String,
           let contentId = result["contentId"] as? String,
           let completion = self.extractFairplayCompletions.removeValue(forKey: requestId) {
            self.invalidateRequestWithId(requestId)
            completion(contentId, nil)
        } else {
            print(CPI_TAG, "Failed to process extracted contentId result")
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
