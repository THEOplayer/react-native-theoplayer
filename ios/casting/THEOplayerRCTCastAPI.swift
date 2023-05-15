//
//  THEOplayerRCTAdsAPI.swift
//  Theoplayer
//
//  Created by William van Haevre on 09/09/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

let ERROR_CODE_CAST_ACCESS_FAILURE = "cast_access_failure"
let ERROR_MESSAGE_CASTING_UNSUPPORTED_FEATURE = "Chromecast and Airplay are not supported by the provided SDK"
let ERROR_MESSAGE_CAST_ACCESS_FAILURE = "Could not access THEOplayer Cast Module"

@objc(THEOplayerRCTCastAPI)
class THEOplayerRCTCastAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    static func moduleName() -> String! {
        return "CastModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    // MARK: CHROMECAST AND AIRPLAY
#if os(iOS)
    
    @objc(casting:resolver:rejecter:)
    func casting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as! THEOplayerRCTView
            if let cast = theView.cast() {
                resolve(cast.casting)
            } else {
                reject(ERROR_CODE_CAST_ACCESS_FAILURE, ERROR_MESSAGE_CAST_ACCESS_FAILURE, nil)
                if DEBUG_CAST_API { PrintUtils.printLog(logText: "[NATIVE] Could not retrieve current casting status (cast module unavailable).") }
            }
        }
    }
    
#else
    
    @objc(casting:resolver:rejecter:)
    func casting(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_CAST_API { print(ERROR_MESSAGE_CASTING_UNSUPPORTED_FEATURE) }
        resolve(false)
    }
    
#endif
    
}
