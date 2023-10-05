//
//  THEOplayerRCTAdsAPI.swift
//  Theoplayer
//
import Foundation
import UIKit
#if canImport(THEOplayerGoogleIMAIntegration)
import THEOplayerGoogleIMAIntegration
#endif

let ERROR_CODE_ADS_ACCESS_FAILURE = "ads_access_failure"
let ERROR_CODE_ADS_GET_PLAYING_STATE_FAILED = "ads_get_playing_state_failure"
let ERROR_CODE_ADS_GET_CURRENT_ADBREAK_FAILED = "ads_get_current_adbreak_failure"
let ERROR_CODE_ADS_GET_CURRENT_ADBREAK_UNDEFINED = "ads_get_current_adbreak_undefined"
let ERROR_CODE_ADS_GET_CURRENT_ADS_FAILED = "ads_get_current_ads_failure"
let ERROR_CODE_ADS_GET_CURRENT_ADS_UNDEFINED = "ads_get_current_ads_undefined"
let ERROR_CODE_ADS_GET_SCHEDULED_ADBREAKS_FAILED = "ads_get_scheduled_adbreaks_failure"
let ERROR_CODE_ADS_GET_SCHEDULED_ADBREAKS_UNDEFINED = "ads_get_scheduled_adbreaks_undefined"
let ERROR_MESSAGE_ADS_ACCESS_FAILURE = "Could not access THEOplayer Ads Module"
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

#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(THEOplayerGoogleIMAIntegration)
    @objc(skip:)
    func skip(_ node: NSNumber) -> Void {
        
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads() {
                ads.skip()
            } else {
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not skip ad (ads module unavailable).") }
            }
        }
    }
    
    @objc(playing:resolver:rejecter:)
    func playing(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads() {
                resolve(ads.playing)
            } else {
                reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not skip ad (ads module unavailable).") }
            }
        }
    }
    
    @objc(currentAdBreak:resolver:rejecter:)
    func currentAdBreak(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads(),
               let currentAdBreak = ads.currentAdBreak {
                resolve(THEOplayerRCTAdAggregator.aggregateAdBreak(adBreak:currentAdBreak))
            } else {
                reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current adbreak (ads module unavailable).") }
            }
        }
    }
    
    @objc(currentAds:resolver:rejecter:)
    func currentAds(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads() {
                let currentAdsArray = ads.currentAds
                var currentAds: [[String:Any]] = []
                for ad in currentAdsArray {
                    currentAds.append(THEOplayerRCTAdAggregator.aggregateAd(ad: ad))
                }
                resolve(currentAds)
            } else {
                reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current ad (ads module unavailable).") }
            }
        }
    }
    
    @objc(scheduledAdBreaks:resolver:rejecter:)
    func scheduledAdBreaks(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let ads = theView.ads() {
                let currentAdBreaksArray = ads.scheduledAdBreaks
                var currentAdBreaks: [[String:Any]] = []
                for adbreak in currentAdBreaksArray {
                    currentAdBreaks.append(THEOplayerRCTAdAggregator.aggregateAdBreak(adBreak: adbreak))
                }
                resolve(currentAdBreaks)
            } else {
                reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current ad (ads module unavailable).") }
            }
        }
    }
    
    @objc(schedule:ad:)
    func schedule(_ node: NSNumber, adDict: NSDictionary) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let adData = adDict as? [String:Any],
               let ads = theView.ads(),
               let adDescription = THEOplayerRCTSourceDescriptionBuilder.buildSingleAdDescription(adData) {
                ads.schedule(adDescription: adDescription)
            } else {
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not schedule new ad.") }
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
    
#endif

}
