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

@objc
public class THEOplayerRCTAdsAPI: NSObject {
    
#if canImport(THEOplayerGoogleIMAIntegration)
    func skip(_ view: THEOplayerRCTView? = nil) -> Void {
        if let theView = view,
           let ads = theView.ads() {
            ads.skip()
        } else {
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not skip ad (ads module unavailable).") }
        }
    }
    
    @objc(playing:resolver:rejecter:)
    func playing(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let theView = view,
           let ads = theView.ads() {
            resolve(ads.playing)
        } else {
            reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not skip ad (ads module unavailable).") }
        }
    }
    
    @objc(currentAdBreak:resolver:rejecter:)
    func currentAdBreak(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let theView = view,
           let ads = theView.ads(),
           let currentAdBreak = ads.currentAdBreak {
            resolve(THEOplayerRCTAdAdapter.fromAdBreak(adBreak:currentAdBreak))
        } else {
            reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current adbreak (ads module unavailable).") }
        }
        
    }
    
    @objc(currentAds:resolver:rejecter:)
    func currentAds(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let theView = view,
           let ads = theView.ads() {
            let currentAdsArray = ads.currentAds
            var currentAds: [[String:Any]] = []
            for ad in currentAdsArray {
                currentAds.append(THEOplayerRCTAdAdapter.fromAd(ad: ad))
            }
            resolve(currentAds)
        } else {
            reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current ad (ads module unavailable).") }
        }
    }
    
    @objc(scheduledAdBreaks:resolver:rejecter:)
    func scheduledAdBreaks(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let theView = view,
           let ads = theView.ads() {
            let currentAdBreaksArray = ads.scheduledAdBreaks
            var currentAdBreaks: [[String:Any]] = []
            for adbreak in currentAdBreaksArray {
                currentAdBreaks.append(THEOplayerRCTAdAdapter.fromAdBreak(adBreak: adbreak))
            }
            resolve(currentAdBreaks)
        } else {
            reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current ad (ads module unavailable).") }
        }
    }
    
    @objc(schedule:ad:)
    func schedule(_ view: THEOplayerRCTView? = nil, adDict: NSDictionary) -> Void {
        if let theView = view,
           let adData = adDict as? [String:Any],
           let ads = theView.ads(),
           let adDescription = THEOplayerRCTSourceDescriptionBuilder.buildSingleAdDescription(adData) {
            ads.schedule(adDescription: adDescription)
        } else {
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not schedule new ad.") }
        }
    }
    
#else
    
    func skip(_ view: THEOplayerRCTView? = nil) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        return
    }
    
    func playing(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
    func currentAdBreak(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve([:])
    }
    
    func currentAds(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve([])
    }
    
    func scheduledAdBreaks(_ view: THEOplayerRCTView? = nil, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve([])
        // TODO: handle request for scheduled adbreaks. Awaiting iOS SDK implementation
    }
    
    func schedule(_ view: THEOplayerRCTView? = nil, adDict: NSDictionary) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        return
    }
    
#endif
    
}
