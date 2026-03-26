//
//  THEOplayerRCTMediaControlAPI.swift
//

import Foundation
import UIKit
import THEOplayerSDK

let MC_TAG: String = "[ContentProtectionMediaControlAPI]"

@objc(THEOplayerRCTMediaControlAPI)
class THEOplayerRCTMediaControlAPI: RCTEventEmitter {

    override static func moduleName() -> String! {
        return "THEOplayerRCTMediaControlAPI"
    }

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override func supportedEvents() -> [String]! {
        return ["MediaControlEvent"]
    }

    @objc(setHandler:action:)
    func setHandler(_ node: NSNumber, action: String) -> Void {
        DispatchQueue.main.async {
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView,
               let player = theView.player {
                if DEBUG_MEDIA_CONTROL_API || true { PrintUtils.printLog(logText: "[NATIVE] Handler set for \(action) action") }
            }
        }
    }
}
