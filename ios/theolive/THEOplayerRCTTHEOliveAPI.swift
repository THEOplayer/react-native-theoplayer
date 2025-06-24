//
//  THEOplayerRCTTHEOliveAPI.swift
//  Theoplayer
//
import Foundation

#if canImport(THEOplayerTHEOliveIntegration)
import THEOplayerTHEOliveIntegration
#endif

let ERROR_MESSAGE_THEOLIVE_UNSUPPORTED_FEATURE = "This functionality is not supported by the provided iOS SDKs"
let ERROR_CODE_THEOLIVE_ACCESS_FAILURE = "theolive_access_failure"
let ERROR_MESSAGE_THEOLIVE_ACCESS_FAILURE = "Could not access THEOplayer THEOlive Module"

@objc(THEOplayerRCTTHEOliveAPI)
class THEOplayerRCTTHEOliveAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    static func moduleName() -> String! {
        return "THEORCTTHEOliveModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

#if canImport(THEOplayerTHEOliveIntegration)
    @objc(currentLatency:resolver:rejecter:)
    func currentLatency(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player,
               let theolive = player.theoLive {
                /*if let currentLatency = theolive.currentLatency {
                    resolve(currentLatency)
                }*/
                resolve(-1)
            } else {
                if DEBUG_THEOLIVE_API { PrintUtils.printLog(logText: "[NATIVE] Could not get currentLatency (THEOlive module unavailable).") }
                reject(ERROR_CODE_THEOLIVE_ACCESS_FAILURE, ERROR_MESSAGE_THEOLIVE_ACCESS_FAILURE, nil)
            }
        }
    }
    
    @objc(latencies:resolver:rejecter:)
    func latencies(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player,
               let theolive = player.theoLive {
                /*if let latencies = theolive.latencies {
                    resolve([
                        "engineLatency": latencies.engineLatency,
                        "distributionLatency": latencies.distributionLatency,
                        "playerLatency": latencies.playerLatency,
                        "theoliveLatency": latencies.theoliveLatency
                    ])
                 }*/
                resolve([:])
            } else {
                if DEBUG_THEOLIVE_API { PrintUtils.printLog(logText: "[NATIVE] Could not get latencies (THEOlive module unavailable).") }
                reject(ERROR_CODE_THEOLIVE_ACCESS_FAILURE, ERROR_MESSAGE_THEOLIVE_ACCESS_FAILURE, nil)
            }
        }
    }

#else

    @objc(currentLatency:resolver:rejecter:)
    func currentLatency(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_THEOLIVE_API { print(ERROR_MESSAGE_THEOLIVE_UNSUPPORTED_FEATURE) }
        reject(ERROR_CODE_THEOLIVE_ACCESS_FAILURE, ERROR_MESSAGE_THEOLIVE_ACCESS_FAILURE, nil)
    }

    @objc(latencies:resolver:rejecter:)
    func latencies(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if DEBUG_THEOLIVE_API { print(ERROR_MESSAGE_THEOLIVE_UNSUPPORTED_FEATURE) }
        reject(ERROR_CODE_THEOLIVE_ACCESS_FAILURE, ERROR_MESSAGE_THEOLIVE_ACCESS_FAILURE, nil)
    }

#endif

}
