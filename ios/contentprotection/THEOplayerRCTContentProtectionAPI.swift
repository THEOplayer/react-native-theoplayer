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
    private var certificateRequestCompletions: [String:(Data?, Error?) -> Void] = [:]                   // [requestId : completion]
    private var certificateResponseCompletions: [String:(Data?, Error?) -> Void] = [:]                  // [requestId : completion]
    private var licenseRequestCompletions: [String:(Data?, Error?) -> Void] = [:]                       // [requestId : completion]
    private var licenseResponseCompletions: [String:(Data?, Error?) -> Void] = [:]                      // [requestId : completion]
    private var extractFairplayCompletions: [String:(String, Error?) -> Void] = [:]                     // [requestId : completion]
    private var requestTimers: [String:Timer] = [:]                                                     // [requestId : Timer]
    private var requestIntegrationIds: [String:String] = [:]                                            // [requestId : integrationId]
    private var requestKeySystemIds: [String:String] = [:]                                              // [requestId : keySystemId]
    
    
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
            if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "Build timeout reached: removing completion for request with Id \(requestId)") }
            self.invalidateRequestWithId(requestId)
            self.buildIntegrationCompletions.removeValue(forKey: requestId)
        })
    }
    
    func handleCertificateRequest(integrationId: String, keySystemId: String, certificateRequest: CertificateRequest, completion: @escaping (Data?, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleCertificateRequest.") }
        let requestId = UUID().uuidString
        self.requestIntegrationIds[requestId] = integrationId
        self.requestKeySystemIds[requestId] = keySystemId
        self.certificateRequestCompletions[requestId] = completion
        self.sendEvent(withName: "onCertificateRequest",
                       body: THEOplayerRCTContentProtectionAggregator.aggregateCertificateRequest(integrationId: integrationId,
                                                                                                  keySystemId: keySystemId,
                                                                                                  requestId: requestId,
                                                                                                  certificateRequest: certificateRequest))
        self.requestTimers[requestId] = Timer.scheduledTimer(withTimeInterval: BRIDGE_REQUEST_TIMEOUT, repeats: false, block: { t in
            if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateRequest timeout reached: removing completion for request with Id \(requestId)") }
            self.invalidateRequestWithId(requestId)
            self.requestIntegrationIds.removeValue(forKey: requestId)
            self.requestKeySystemIds.removeValue(forKey: requestId)
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
            if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateResponse timeout reached: removing completion for request with Id \(requestId)") }
            self.invalidateRequestWithId(requestId)
            self.certificateResponseCompletions.removeValue(forKey: requestId)
        })
    }
    
    func handleLicenseRequest(integrationId: String, keySystemId: String, licenseRequest: LicenseRequest, completion: @escaping (Data?, Error?) -> Void) {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "handleLicenseRequest.") }
        let requestId = UUID().uuidString
        self.requestIntegrationIds[requestId] = integrationId
        self.requestKeySystemIds[requestId] = keySystemId
        self.licenseRequestCompletions[requestId] = completion
        self.sendEvent(withName: "onLicenseRequest",
                       body: THEOplayerRCTContentProtectionAggregator.aggregateLicenseRequest(integrationId: integrationId,
                                                                                              keySystemId: keySystemId,
                                                                                              requestId: requestId,
                                                                                              licenseRequest: licenseRequest))
        self.requestTimers[requestId] = Timer.scheduledTimer(withTimeInterval: BRIDGE_REQUEST_TIMEOUT, repeats: false, block: { t in
            if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseRequest timeout reached: removing completion for request with Id \(requestId)") }
            self.invalidateRequestWithId(requestId)
            self.requestIntegrationIds.removeValue(forKey: requestId)
            self.requestKeySystemIds.removeValue(forKey: requestId)
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
            if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseResponse timeout reached: removing completion for request with Id \(requestId)") }
            self.invalidateRequestWithId(requestId)
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
            if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "Fairplay contentId extraction timeout reached: removing completion for request with Id \(requestId)") }
            self.invalidateRequestWithId(requestId)
            self.extractFairplayCompletions.removeValue(forKey: requestId)
        })
    }
    
    // MARK: Incoming JS Notifications
    @objc(registerContentProtectionIntegration:keySystemId:)
    func registerContentProtectionIntegration(_ integrationId: String, keySystemId: String) -> Void {
        if keySystemId == "fairplay" {
            if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "Registering ContentProtectionIntegration for \(integrationId) - \(keySystemId)") }
            // Create a proxy factory
            let integrationFactory = THEOplayerRCTProxyContentProtectionIntegrationFactory(contentProtectionAPI: self,
                                                                                           integrationId: integrationId,
                                                                                           keySystemId: keySystemId)
            // Register that factory on the THEOplayerSDK:
            let keySystem = self.keySystemFromString(keySystemId)
            THEOplayerSDK.THEOplayer.registerContentProtectionIntegration(integrationId: integrationId,
                                                                          keySystem: keySystem,
                                                                          integrationFactory: integrationFactory)
        } else {
            if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "Prevented registering ContentProtectionIntegration for \(integrationId) - \(keySystemId)") }
        }
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
    
    @objc(onCertificateRequestProcessedAsRequest:)
    func onCertificateRequestProcessedAsRequest(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateRequestProcessedAsRequest.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.certificateRequestCompletions.removeValue(forKey: requestId),
           let integrationId = self.requestIntegrationIds.removeValue(forKey: requestId),
           let keySystemId = self.requestKeySystemIds.removeValue(forKey: requestId),
           let urlString = result["url"] as? String,
           let url = URL(string: urlString),
           let method = result["method"] as? String,
           let headers = result["headers"] as? [String:String] {
            var bodyData: Data?
            if let base64body = result["base64body"] as? String {
                bodyData = Data(base64Encoded: base64body, options: .ignoreUnknownCharacters)
            }
            self.invalidateRequestWithId(requestId)
            THEOplayerRCTNetworkUtils.shared.requestFromUrl(url: url, method: method, body: bodyData, headers: headers) { data, statusCode, responseHeaders, error in
                if let responseError = error {
                    print(CPI_TAG, "Certificate request failure: error = \(responseError.localizedDescription)")
                } else if statusCode >= 400 {
                    print("Certificate request failure: statusCode = \(statusCode)")
                } else {
                    if DEBUG_CONTENT_PROTECTION_API {print(CPI_TAG, "Certificate request success: statusCode = \(statusCode)") }
                    let certificateRequest = CertificateRequest(url: urlString, method: method, headers: headers, body: bodyData)
                    let certificateResponse = CertificateResponse(certificateRequest: certificateRequest, url: urlString, status: statusCode, statusText: "", headers: responseHeaders, body: data ?? Data())
                    self.handleCertificateResponse(integrationId: integrationId, keySystemId: keySystemId, certificateResponse: certificateResponse) { data, error in
                        completion(data, error)
                    }
                }
            }
        } else {
            print(CPI_TAG, "Failed to process certificate request as request")
        }
    }
    
    @objc(onCertificateRequestProcessedAsCertificate:)
    func onCertificateRequestProcessedAsCertificate(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onCertificateRequestProcessedAsCertificate.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.certificateRequestCompletions.removeValue(forKey: requestId) {
            var bodyData = Data()
            if let base64body = result["base64body"] as? String {
                bodyData = Data(base64Encoded: base64body, options: .ignoreUnknownCharacters) ?? Data()
            }
            self.invalidateRequestWithId(requestId)
            completion(bodyData, nil)
        } else {
            print(CPI_TAG, "Failed to process certificate request as certificate")
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
            print(CPI_TAG, "Failed to process certificate response")
        }
    }
    
    @objc(onLicenseRequestProcessedAsRequest:)
    func onLicenseRequestProcessedAsRequest(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseRequestProcessedAsRequest.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.licenseRequestCompletions.removeValue(forKey: requestId),
           let integrationId = self.requestIntegrationIds.removeValue(forKey: requestId),
           let keySystemId = self.requestKeySystemIds.removeValue(forKey: requestId),
           let urlString = result["url"] as? String,
           let url = URL(string: urlString),
           let method = result["method"] as? String,
           let headers = result["headers"] as? [String:String] {
            var bodyData: Data?
            if let base64body = result["base64body"] as? String {
                bodyData = Data(base64Encoded: base64body, options: .ignoreUnknownCharacters)
            }
            self.invalidateRequestWithId(requestId)
            THEOplayerRCTNetworkUtils.shared.requestFromUrl(url: url, method: method, body: bodyData, headers: headers) { data, statusCode, responseHeaders, error in
                if let responseError = error {
                    print(CPI_TAG, "License request failure: error = \(responseError.localizedDescription)")
                } else if statusCode >= 400 {
                    print(CPI_TAG, "License request failure: statusCode = \(statusCode)")
                } else {
                    if DEBUG_CONTENT_PROTECTION_API {print(CPI_TAG, "License request success: statusCode = \(statusCode)") }
                    let licenseRequest = LicenseRequest(url: urlString, method: method, headers: headers, body: bodyData, fairplaySkdUrl: nil, useCredentials: false)
                    let licenseResponse = LicenseResponse(licenseRequest: licenseRequest, url: urlString, status: statusCode, statusText: "", headers: responseHeaders, body: data ?? Data())
                    self.handleLicenseResponse(integrationId: integrationId, keySystemId: keySystemId, licenseResponse: licenseResponse) { data, error in
                        completion(data, error)
                    }
                }
            }
        } else {
            print(CPI_TAG, "Failed to process license request as request")
        }
    }
    
    @objc(onLicenseRequestProcessedAsLicense:)
    func onLicenseRequestProcessedAsLicense(_ result: NSDictionary) -> Void {
        if DEBUG_CONTENT_PROTECTION_API { print(CPI_TAG, "onLicenseRequestProcessedAsLicense.") }
        if let requestId = result["requestId"] as? String,
           let completion = self.licenseRequestCompletions.removeValue(forKey: requestId) {
            var bodyData = Data()
            if let base64body = result["base64body"] as? String {
                bodyData = Data(base64Encoded: base64body, options: .ignoreUnknownCharacters) ?? Data()
            }
            self.invalidateRequestWithId(requestId)
            completion(bodyData, nil)
        } else {
            print(CPI_TAG, "Failed to process license request as license")
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
            print(CPI_TAG, "Failed to process license response")
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
