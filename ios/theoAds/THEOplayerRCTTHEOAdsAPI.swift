//
//  THEOplayerRCTTHEOAdsAPI.swift
//  Theoplayer
//
import Foundation

#if canImport(THEOplayerTHEOadsIntegration)
import THEOplayerTHEOadsIntegration
#endif

let ERROR_MESSAGE_THEOADS_UNSUPPORTED_FEATURE = "This functionality is not supported by the provided iOS SDKs"
let ERROR_CODE_THEOADS_ACCESS_FAILURE = "theoads_access_failure"
let ERROR_MESSAGE_THEOADS_ACCESS_FAILURE = "Could not access THEOplayer THEOAds Module"

@objc(THEOplayerRCTTHEOAdsAPI)
class THEOplayerRCTTHEOAdsAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    static func moduleName() -> String! {
        return "THEORCTTHEOAdsModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

#if canImport(THEOplayerTHEOadsIntegration)
    @objc(currentInterstitials:resolver:rejecter:)
    func currentInterstitials(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player,
               let theoAds = player.ads.theoAds {
                var currentInterstitials: [[String:Any]] = []
                for interstitial in theoAds.currentInterstitials {
                    currentInterstitials.append(THEOplayerRCTTHEOadsEventAdapter.fromInterstitial(interstitial))
                }
                resolve(currentInterstitials)
            } else {
                if DEBUG_THEOADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not get currentInterstitials (THEOAds module unavailable).") }
                reject(ERROR_CODE_THEOADS_ACCESS_FAILURE, ERROR_MESSAGE_THEOADS_ACCESS_FAILURE, nil)
            }
        }
    }
    
    @objc(scheduledInterstitials:resolver:rejecter:)
    func scheduledInterstitials(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player,
               let theoAds = player.ads.theoAds {
                var scheduledInterstitials: [[String:Any]] = []
                for interstitial in theoAds.scheduledInterstitials {
                    scheduledInterstitials.append(THEOplayerRCTTHEOadsEventAdapter.fromInterstitial(interstitial))
                }
                resolve(scheduledInterstitials)
            } else {
                if DEBUG_THEOADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not get scheduledInterstitials (THEOAds module unavailable).") }
                reject(ERROR_CODE_THEOADS_ACCESS_FAILURE, ERROR_MESSAGE_THEOADS_ACCESS_FAILURE, nil)
            }
        }
    }
    
    @objc(replaceAdTagParameters:adTagParameters:)
    func replaceAdTagParameters(_ node: NSNumber, adTagParameters: [String:Any]?) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player,
               let theoAds = player.ads.theoAds {
                if let newParams = adTagParameters as? [String: String] {
                    theoAds.replaceAdTagParams(params: newParams)
                    if DEBUG_THEOADS_API { PrintUtils.printLog(logText: "[NATIVE] THEOAds adTagParameters replaced.") }
                } else {
                    if DEBUG_THEOADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not replace THEOAds adTagParameters.") }
                }
            }
        }
    }

#else

    @objc(currentInterstitials:resolver:rejecter:)
    func currentInterstitials(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_THEOADS_API { print(ERROR_MESSAGE_THEOADS_UNSUPPORTED_FEATURE) }
        reject(ERROR_CODE_THEOADS_ACCESS_FAILURE, ERROR_MESSAGE_THEOADS_ACCESS_FAILURE, nil)
    }

    @objc(scheduledInterstitials:resolver:rejecter:)
    func scheduledInterstitials(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_THEOADS_API { print(ERROR_MESSAGE_THEOADS_UNSUPPORTED_FEATURE) }
        reject(ERROR_CODE_THEOADS_ACCESS_FAILURE, ERROR_MESSAGE_THEOADS_ACCESS_FAILURE, nil)
    }
    
    @objc(replaceAdTagParameters:token:)
    func replaceAdTagParameters(_ node: NSNumber, adTagParameters: [String:Any]?) -> Void {
        if DEBUG_THEOADS_API { print(ERROR_MESSAGE_THEOADS_UNSUPPORTED_FEATURE) }
    }

#endif

}
