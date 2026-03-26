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
    }
}
