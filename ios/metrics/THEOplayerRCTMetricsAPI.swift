//
//  THEOplayerRCTMetricsAPI.swift
//  Theoplayer
//
import Foundation
import UIKit

let ERROR_CODE_METRICS_ACCESS_FAILURE = "metrics_access_failure"
let ERROR_MESSAGE_METRICS_ACCESS_FAILURE = "Could not access THEOplayer Metrics"

@objc(THEOplayerRCTMetricsAPI)
class THEOplayerRCTMetricsAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    static func moduleName() -> String! {
        return "THEORCTMetricsModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(currentBandwidthEstimate:resolver:rejecter:)
    func currentBandwidthEstimate(_ node: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        withViewAndPlayer(node) { _, player in
            resolve(player.metrics.currentBandwidthEstimate)
        } onFailure: {
            reject(ERROR_CODE_METRICS_ACCESS_FAILURE, ERROR_MESSAGE_METRICS_ACCESS_FAILURE, nil)
        }
    }
}
