//
//  THEOplayerRCTMediaControlAPI.swift
//

import Foundation
import UIKit
import THEOplayerSDK

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
            if let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView {
                let mediaControlManager = theView.mediaControlManager
                let mediaControlAction = THEOplayerRCTTypeUtils.mediaControlActionFromString(action)
                mediaControlManager.setMediaControlActionHandler(action: mediaControlAction, handler: self.handlerForAction(action, node: node))
                if DEBUG_MEDIA_CONTROL_API { PrintUtils.printLog(logText: "[NATIVE] Handler set for \(action) action") }
            }
        }
    }
    
    private func handlerForAction(_ action: String, node: NSNumber) -> (() -> Void) {
        return { [weak self] in
            if let self = self {
                self.sendEvent(
                    withName: "MediaControlEvent",
                    body: [
                        "action": action,
                        "tag": node
                    ]
                )
            }
            if DEBUG_MEDIA_CONTROL_API { PrintUtils.printLog(logText: "[NATIVE] Handler triggered for \(action) action") }
        }
    }
        
}
