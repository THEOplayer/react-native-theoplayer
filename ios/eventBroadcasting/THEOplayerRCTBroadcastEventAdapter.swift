//
//  THEOplayerRCTPlayerAPI.swift
//

import Foundation
import THEOplayerSDK

let EVENT_PROP_TYPE: String = "type"

class THEOplayerRCTBroadcastEventAdapter {
    class func toEvent(eventData: NSDictionary) -> THEOplayerSDK.EventProtocol? {
        if let type = eventData[EVENT_PROP_TYPE] as? String {
            switch (type) {
            case "adevent": return THEOplayerRCTAdEventAdapter.toAdEvent(eventData: eventData)
            // more cases to be added on demand...
            default: return nil
            }
        }

        return nil
    }
}
