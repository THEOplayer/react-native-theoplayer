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
let ERROR_CODE_DAI_ACCESS_FAILURE = "dai_access_failure"
let ERROR_CODE_ADS_GET_PLAYING_STATE_FAILED = "ads_get_playing_state_failure"
let ERROR_CODE_ADS_GET_CURRENT_ADBREAK_FAILED = "ads_get_current_adbreak_failure"
let ERROR_CODE_ADS_GET_CURRENT_ADBREAK_UNDEFINED = "ads_get_current_adbreak_undefined"
let ERROR_CODE_ADS_GET_CURRENT_ADS_FAILED = "ads_get_current_ads_failure"
let ERROR_CODE_ADS_GET_CURRENT_ADS_UNDEFINED = "ads_get_current_ads_undefined"
let ERROR_CODE_ADS_GET_SCHEDULED_ADBREAKS_FAILED = "ads_get_scheduled_adbreaks_failure"
let ERROR_CODE_ADS_GET_SCHEDULED_ADBREAKS_UNDEFINED = "ads_get_scheduled_adbreaks_undefined"

let ERROR_MESSAGE_ADS_ACCESS_FAILURE = "Could not access THEOplayer Ads Module"
let ERROR_MESSAGE_DAI_ACCESS_FAILURE = "Could not access THEOplayer Ads DAI Module"
let ERROR_MESSAGE_ADS_GET_CURRENT_ADBREAK_UNDEFINED = "Undefined adBreak object"
let ERROR_MESSAGE_ADS_GET_CURRENT_ADS_UNDEFINED = "Undefined ads array"
let ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE = "This functionality is not supported by the provided iOS SDK"
let ERROR_MESSAGE_ADS_GET_SCHEDULED_ADBREAKS_UNDEFINED = "Undefined adbreaks array"

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
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads() {
                ads.requestScheduledAdBreaks { adBreaksArray, error in
                    if let err = error {
                        reject(ERROR_CODE_ADS_GET_SCHEDULED_ADBREAKS_FAILED, err.localizedDescription, error)
                        if DEBUG_ADS_API { print("[NATIVE] Retrieving scheduled adbreaks failed: \(err.localizedDescription)") }
                    } else if let currentAdBreaksArray = adBreaksArray {
                        var currentAdBreaks: [[String:Any]] = []
                        for adbreak in currentAdBreaksArray {
                            currentAdBreaks.append(THEOplayerRCTAdAggregator.aggregateAdBreak(adBreak: adbreak))
                        }
                        resolve(currentAdBreaks)
                    } else {
                        reject(ERROR_CODE_ADS_GET_SCHEDULED_ADBREAKS_UNDEFINED, ERROR_MESSAGE_ADS_GET_SCHEDULED_ADBREAKS_UNDEFINED, nil)
                        if DEBUG_ADS_API { print("[NATIVE] Retrieving current adbreaks failed: could not load adbreaks.") }
                    }
                }
            } else {
                reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { print("[NATIVE] Could not retrieve current ad (ads module unavailable).") }
            }
        }
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
    
    @objc(daiSnapback:resolver:rejecter:)
    func daiSnapback(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        // should always be active for DAI streaming
        resolve(true)
    }
    
    @objc(daiContentTimeForStreamTime:time:resolver:rejecter:)
    func daiContentTimeForStreamTime(_ node: NSNumber, timeValue: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads(),
               let dai = ads.dai {
                let streamTime = timeValue.doubleValue * 0.001                      // msec -> sec
                let contentTime = dai.contentTime(from: streamTime) * 1000.0        // sec -> msec
                resolve(contentTime)
            } else {
                reject(ERROR_CODE_DAI_ACCESS_FAILURE, ERROR_MESSAGE_DAI_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { print("[NATIVE] Could not convert stream time to content time (ads DAI module unavailable).") }
            }
        }
    }
    
    @objc(daiStreamTimeForContentTime:time:resolver:rejecter:)
    func daiStreamTimeForContentTime(_ node: NSNumber, timeValue: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads(),
               let dai = ads.dai {
                let contentTime = timeValue.doubleValue * 0.001                     // msec -> sec
                let streamTime = dai.streamTime(from: contentTime) * 1000.0         // sec -> msec
                resolve(streamTime)
            } else {
                reject(ERROR_CODE_DAI_ACCESS_FAILURE, ERROR_MESSAGE_DAI_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { print("[NATIVE] Could not convert content time to stream time (ads DAI module unavailable).") }
            }
        }
    }
    
#else
    
    @objc(skip:)
    func skip(_ node: NSNumber) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        return
    }
    
    @objc(playing:resolver:rejecter:)
    func playing(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
    @objc(currentAdBreak:resolver:rejecter:)
    func currentAdBreak(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve([:])
    }
    
    @objc(currentAds:resolver:rejecter:)
    func currentAds(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve([])
    }
    
    @objc(scheduledAdBreaks:resolver:rejecter:)
    func scheduledAdBreaks(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve([])
        // TODO: handle request for scheduled adbreaks. Awaiting iOS SDK implementation
    }
    
    @objc(schedule:ad:)
    func schedule(_ node: NSNumber, adDict: NSDictionary) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        return
    }
    
    @objc(daiSnapback:resolver:rejecter:)
    func daiSnapback(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
    @objc(daiContentTimeForStreamTime:time:resolver:rejecter:)
    func daiContentTimeForStreamTime(_ node: NSNumber, timeValue: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve(timeValue.doubleValue)
    }
    
    @objc(daiStreamTimeForContentTime:time:resolver:rejecter:)
    func daiStreamTimeForContentTime(_ node: NSNumber, timeValue: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve(timeValue.doubleValue)
    }
    
#endif
}
