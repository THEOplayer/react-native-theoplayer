//
//  THEOplayerRCTPlayerAPI.swift
//

import Foundation
import THEOplayerSDK

protocol EventReceiver {
    func onReceivedEvent()
}

class THEOplayerRCTEventBroadcastAPI {
    
    func broadcastEvent(_ view: THEOplayerRCTView? = nil, event: NSDictionary) -> Void {
        if let theView = view {
            theView.broadcastEventHandler.broadcastEvent(eventData: event)
        }
    }
}
