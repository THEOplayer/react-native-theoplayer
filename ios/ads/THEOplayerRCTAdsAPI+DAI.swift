//  THEOplayerRCTAdsAPI+DAI.swift

import Foundation
import UIKit

let ERROR_CODE_DAI_ACCESS_FAILURE = "dai_access_failure"
let ERROR_CODE_DAI_GET_SNAPBACK_FAILED = "dai_get_snapback_failed"
let ERROR_CODE_DAI_GET_SNAPBACK_UNDEFINED = "dai_get_snapback_undefined"
let ERROR_MESSAGE_DAI_ACCESS_FAILURE = "Could not access THEOplayer Ads DAI Module"
let ERROR_MESSAGE_DAI_GET_SNAPBACK_UNDEFINED = "Undefined dai snapback"

extension THEOplayerRCTAdsAPI {
    
#if canImport(THEOplayerGoogleIMAIntegration)
    @objc(daiSnapback:resolver:rejecter:)
    func daiSnapback(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let ads = theView.ads(),
               let dai = ads.dai {
                resolve(dai.snapback)
            } else {
                reject(ERROR_CODE_DAI_ACCESS_FAILURE, ERROR_MESSAGE_DAI_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve dai snapback status (ads DAI module unavailable).") }
            }
        }
    }
    
    @objc(daiSetSnapback:enabled:)
    func daiSetSnapback(_ node: NSNumber, enabled: Bool) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let ads = theView.ads(),
               var dai = ads.dai {
                dai.snapback = enabled
            } else {
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not update dai snapback status (ads DAI module unavailable).") }
            }
        }
    }
    
    @objc(daiContentTimeForStreamTime:time:resolver:rejecter:)
    func daiContentTimeForStreamTime(_ node: NSNumber, timeValue: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let ads = theView.ads(),
               let dai = ads.dai {
                let streamTime = timeValue.doubleValue * 0.001                      // msec -> sec
                let contentTime = dai.contentTime(from: streamTime) * 1000.0        // sec -> msec
                resolve(contentTime)
            } else {
                reject(ERROR_CODE_DAI_ACCESS_FAILURE, ERROR_MESSAGE_DAI_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not convert stream time to content time (ads DAI module unavailable).") }
            }
        }
    }
    
    @objc(daiStreamTimeForContentTime:time:resolver:rejecter:)
    func daiStreamTimeForContentTime(_ node: NSNumber, timeValue: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let ads = theView.ads(),
               let dai = ads.dai {
                let contentTime = timeValue.doubleValue * 0.001                     // msec -> sec
                let streamTime = dai.streamTime(from: contentTime) * 1000.0         // sec -> msec
                resolve(streamTime)
            } else {
                reject(ERROR_CODE_DAI_ACCESS_FAILURE, ERROR_MESSAGE_DAI_ACCESS_FAILURE, nil)
                if DEBUG_ADS_API { PrintUtils.printLog(logText: "[NATIVE] Could not convert content time to stream time (ads DAI module unavailable).") }
            }
        }
    }
    
#else
    
    @objc(daiSnapback:resolver:rejecter:)
    func daiSnapback(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
    @objc(daiSetSnapback:enabled:)
    func daiSetSnapback(_ node: NSNumber, enabled: Bool) -> Void {
        if DEBUG_ADS_API { print(ERROR_MESSAGE_ADS_UNSUPPORTED_FEATURE) }
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



