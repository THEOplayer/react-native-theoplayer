// THEOplayerRCTView+UIConfig.swift

import Foundation
import THEOplayerSDK

struct MediaControlConfig {
    var skipForwardInterval: Int = 15
    var skipBackwardInterval: Int = 15
    var convertSkipToSeek: Bool = false
}

extension THEOplayerRCTView {
    
    func parseMediaControlConfig(configDict: NSDictionary) {
        if let mediaControlConfig = configDict["mediaControl"] as? NSDictionary {
            if let skipForwardInterval = mediaControlConfig["skipForwardInterval"] as? Int {
                self.mediaControlConfig.skipForwardInterval = skipForwardInterval
            }
            if let skipBackwardInterval = mediaControlConfig["skipBackwardInterval"] as? Int {
                self.mediaControlConfig.skipBackwardInterval = skipBackwardInterval
            }
            if let convertSkipToSeek = mediaControlConfig["convertSkipToSeek"] as? Bool {
                self.mediaControlConfig.convertSkipToSeek = convertSkipToSeek
            }
        }
    }
}
