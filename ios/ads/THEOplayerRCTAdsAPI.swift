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
        return "THEORCTAdsModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

#if canImport(THEOplayerGoogleIMAIntegration)
    @objc(skip:)
    func skip(_ node: NSNumber) -> Void {

        withViewAndAds(node) { _, ads in
            ads.skip()
        } onFailure: {
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not skip ad (ads module unavailable).") }
        }
    }

    @objc(playing:resolver:rejecter:)
    func playing(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        withViewAndAds(node) { _, ads in
            resolve(ads.playing)
        } onFailure: {
            reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not skip ad (ads module unavailable).") }
        }
    }

    @objc(currentAdBreak:resolver:rejecter:)
    func currentAdBreak(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        withViewAndAds(node) { _, ads in
            if let currentAdBreak = ads.currentAdBreak {
                resolve(THEOplayerRCTAdAdapter.fromAdBreak(adBreak:currentAdBreak))
            } else {
                reject(ERROR_CODE_ADS_GET_CURRENT_ADBREAK_UNDEFINED, ERROR_MESSAGE_ADS_GET_CURRENT_ADBREAK_UNDEFINED, nil)
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current adbreak (no current adbreak).") }
            }
        } onFailure: {
            reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current adbreak (ads module unavailable).") }
        }
    }

    @objc(currentAds:resolver:rejecter:)
    func currentAds(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        withViewAndAds(node) { _, ads in
            let currentAdsArray = ads.currentAds
            var currentAds: [[String:Any]] = []
            for ad in currentAdsArray {
                currentAds.append(THEOplayerRCTAdAdapter.fromAd(ad: ad))
            }
            resolve(currentAds)
        } onFailure: {
            reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current ad (ads module unavailable).") }
        }
    }

    @objc(scheduledAdBreaks:resolver:rejecter:)
    func scheduledAdBreaks(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        withViewAndAds(node) { _, ads in
            let currentAdBreaksArray = ads.scheduledAdBreaks
            var currentAdBreaks: [[String:Any]] = []
            for adbreak in currentAdBreaksArray {
                currentAdBreaks.append(THEOplayerRCTAdAdapter.fromAdBreak(adBreak: adbreak))
            }
            resolve(currentAdBreaks)
        } onFailure: {
            reject(ERROR_CODE_ADS_ACCESS_FAILURE, ERROR_MESSAGE_ADS_ACCESS_FAILURE, nil)
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current ad (ads module unavailable).") }
        }
    }

    @objc(schedule:ad:)
    func schedule(_ node: NSNumber, adDict: NSDictionary) -> Void {
        withViewAndAds(node) { _, ads in
            if let adData = adDict as? [String:Any],
               let adDescription = THEOplayerRCTSourceDescriptionBuilder.buildSingleAdDescription(adData) {
                ads.schedule(adDescription: adDescription)
            }
        } onFailure: {
            if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not schedule new ad.") }
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
