//
//  THEOplayerRCTAdsAPI.swift
//  Theoplayer
//
//  Created by William van Haevre on 09/09/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

let ERROR_CODE_ADS_ACCESS_FAILURE = "ads_access_failure"
let ERROR_CODE_ADS_GET_PLAYING_STATE_FAILED = "ads_get_playing_state_failure"
let ERROR_CODE_ADS_GET_CURRENT_ADBREAK_FAILED = "ads_get_current_adbreak_failure"
let ERROR_CODE_ADS_GET_CURRENT_ADBREAK_UNDEFINED = "ads_get_current_adbreak_undefined"
let ERROR_CODE_ADS_GET_CURRENT_ADS_FAILED = "ads_get_current_ads_failure"
let ERROR_CODE_ADS_GET_CURRENT_ADS_UNDEFINED = "ads_get_current_ads_undefined"
let ERROR_CODE_ADS_SCHEDULED_ADBREAKS_UNSUPPORTED = "ads_scheduled_ads_unsupported"
let ERROR_CODE_ADS_UNSUPPORTED_FEATURE = "ads_unsupported_feature"
let ERROR_MESSAGE_ADS_ACCESS_FAILURE = "Could not access THEOplayer Ads"
let ERROR_MESSAGE_ADS_GET_CURRENT_ADBREAK_UNDEFINED = "Undefined adBreak object"
let ERROR_MESSAGE_ADS_GET_CURRENT_ADS_UNDEFINED = "Undefined ads array"
let ERROR_MESSAGE_ADS_SCHEDULED_ADBREAKS_UNSUPPORTED = "Not yet implemented"
let ERROR_MESSAGE_ADS_SCHEDULED_UNSUPPORTED_FEATURE = "This functionality is not supported by the underlying iOS SDK"

@objc(THEOplayerRCTAdsAPI)
class THEOplayerRCTAdsAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    static func moduleName() -> String! {
        return "AdsModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }

#if ADS && (GOOGLE_IMA || GOOGLE_DAI)
    @objc(skip:)
    func skip(_ node: NSNumber) -> Void {
        
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads() {
                ads.skip()
            } else {
                if DEBUG_ADS_API { print("[NATIVE] Could not skip ad (ads module unavailable).") }
            }
        }
    }
    
    @objc(playing:resolver:rejecter:)
    func playing(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads() {
                ads.requestPlaying { playing, error in
                    if let err = error {
                        reject(ERROR_CODE_ADS_GET_PLAYING_STATE_FAILED, err.localizedDescription, error)
                        if DEBUG_ADS_API { print("[NATIVE] Retrieving ad playing state failed: \(err.localizedDescription)") }
                    } else {
                        resolve(playing)
                    }
                }
            } else {
                reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { print("[NATIVE] Could not skip ad (ads module unavailable).") }
            }
        }
    }
    
    @objc(currentAdBreak:resolver:rejecter:)
    func currentAdBreak(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads() {
                ads.requestCurrentAdBreak { adBreak, error in
                    if let err = error {
                        reject(ERROR_CODE_ADS_GET_CURRENT_ADBREAK_FAILED, err.localizedDescription, error)
                        if DEBUG_ADS_API { print("[NATIVE] Retrieving current adbreak failed: \(err.localizedDescription)") }
                    } else if let currentAdBreak = adBreak {
                        resolve(THEOplayerRCTAdAggregator.aggregateAdBreak(adBreak:currentAdBreak))
                    } else {
                        reject(ERROR_CODE_ADS_GET_CURRENT_ADBREAK_UNDEFINED, ERROR_MESSAGE_ADS_GET_CURRENT_ADBREAK_UNDEFINED, nil)
                        if DEBUG_ADS_API { print("[NATIVE] Retrieving current adbreak failed: could not load adbreak.") }
                    }
                }
            } else {
                reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { print("[NATIVE] Could not retrieve current adbreak (ads module unavailable).") }
            }
        }
    }
    
    @objc(currentAds:resolver:rejecter:)
    func currentAds(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads() {
                ads.requestCurrentAds { adsArray, error in
                    if let err = error {
                        reject(ERROR_CODE_ADS_GET_CURRENT_ADS_FAILED, err.localizedDescription, error)
                        if DEBUG_ADS_API { print("[NATIVE] Retrieving current ads failed: \(err.localizedDescription)") }
                    } else if let currentAdsArray = adsArray {
                        var currentAds: [[String:Any]] = []
                        for ad in currentAdsArray {
                            currentAds.append(THEOplayerRCTAdAggregator.aggregateAd(ad: ad))
                        }
                        resolve(currentAds)
                    } else {
                        reject(ERROR_CODE_ADS_GET_CURRENT_ADS_UNDEFINED, ERROR_MESSAGE_ADS_GET_CURRENT_ADS_UNDEFINED, nil)
                        if DEBUG_ADS_API { print("[NATIVE] Retrieving current ads failed: could not load ads.") }
                    }
                }
            } else {
                reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { print("[NATIVE] Could not retrieve current ad (ads module unavailable).") }
            }
        }
    }
    
    @objc(scheduledAdBreaks:resolver:rejecter:)
    func scheduledAdBreaks(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        reject(ERROR_CODE_ADS_SCHEDULED_ADBREAKS_UNSUPPORTED, ERROR_MESSAGE_ADS_SCHEDULED_ADBREAKS_UNSUPPORTED, nil)
        // TODO: handle request for scheduled adbreaks. Blocked by iOS SDK implementation
    }
    
    @objc(schedule:ad:)
    func schedule(_ node: NSNumber, adDict: NSDictionary) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let adData = adDict as? [String:Any],
               let ads = theView.ads(),
               let adDescription = THEOplayerRCTSourceDescriptionBuilder.buildAdDescription(adData) {
                ads.schedule(adDescription: adDescription)
            } else {
                if DEBUG_ADS_API { print("[NATIVE] Could not schedule new ad.") }
            }
        }
    }
    
#else
    
    @objc(skip:)
    func skip(_ node: NSNumber) -> Void {
        return
    }
    
    @objc(playing:resolver:rejecter:)
    func playing(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        reject(ERROR_CODE_ADS_UNSUPPORTED_FEATURE, ERROR_MESSAGE_ADS_SCHEDULED_UNSUPPORTED_FEATURE, nil)
    }
    
    @objc(currentAdBreak:resolver:rejecter:)
    func currentAdBreak(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        reject(ERROR_CODE_ADS_UNSUPPORTED_FEATURE, ERROR_MESSAGE_ADS_SCHEDULED_UNSUPPORTED_FEATURE, nil)
    }
    
    @objc(currentAds:resolver:rejecter:)
    func currentAds(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        reject(ERROR_CODE_ADS_UNSUPPORTED_FEATURE, ERROR_MESSAGE_ADS_SCHEDULED_UNSUPPORTED_FEATURE, nil)
    }
    
    @objc(scheduledAdBreaks:resolver:rejecter:)
    func scheduledAdBreaks(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        reject(ERROR_CODE_ADS_SCHEDULED_ADBREAKS_UNSUPPORTED, ERROR_MESSAGE_ADS_SCHEDULED_ADBREAKS_UNSUPPORTED, nil)
        // TODO: handle request for scheduled adbreaks. Blocked by iOS SDK implementation
    }
    
    @objc(schedule:ad:)
    func schedule(_ node: NSNumber, adDict: NSDictionary) -> Void {
        return
    }
    
#endif
}
