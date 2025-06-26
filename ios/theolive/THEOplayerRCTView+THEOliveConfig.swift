// THEOplayerRCTView+THEOliveConfig.swift

import Foundation
import THEOplayerSDK

struct THEOliveConfig {
    var externalSessionId: String?
    var discoveryUrl: String?
    var useLegacyTHEOlive: Bool = false
}

extension THEOplayerRCTView {

    func parseTHEOliveConfig(configDict: NSDictionary) {
        if let theoLiveConfig = configDict["theoLive"] as? NSDictionary {
            self.theoliveConfig.externalSessionId = theoLiveConfig["externalSessionId"] as? String
            self.theoliveConfig.discoveryUrl = theoLiveConfig["discoveryUrl"] as? String
            self.theoliveConfig.useLegacyTHEOlive = theoLiveConfig["useLegacyTHEOlive"] as? Bool ?? false
        }
    }
}
