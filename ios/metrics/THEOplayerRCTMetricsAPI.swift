//
//  THEOplayerRCTMetricsAPI.swift
//  Theoplayer
//
import Foundation
import UIKit

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
            // Resolve 0 (rather than rejecting) when the view/player cannot be resolved,
            // so callers polling on an interval do not receive unhandled rejections.
            // This matches the documented contract and the Android/Web behaviour.
            resolve(0.0)
        }
    }
}
