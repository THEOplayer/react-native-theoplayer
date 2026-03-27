// THEOplayerRCTView+MediaControlConfig.swift

import Foundation
import THEOplayerSDK

let DEFAULT_SKIP_INTERVAL = 15
let DEFAULT_CONVERT_SKIP_TO_SEEK = false
let DEFAULT_ALLOW_LIVE_PLAY_PAUSE = true
let DEFAULT_SEEK_TO_LIVE_ON_RESUME = false

struct MediaControlConfig {
    var skipForwardInterval: Int = DEFAULT_SKIP_INTERVAL
    var skipBackwardInterval: Int = DEFAULT_SKIP_INTERVAL
    var convertSkipToSeek: Bool = DEFAULT_CONVERT_SKIP_TO_SEEK
    var allowLivePlayPause: Bool = DEFAULT_ALLOW_LIVE_PLAY_PAUSE
    var seekToLiveOnResume: Bool = DEFAULT_SEEK_TO_LIVE_ON_RESUME
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
            if let allowLivePlayPause = mediaControlConfig["allowLivePlayPause"] as? Bool {
                self.mediaControlConfig.allowLivePlayPause = allowLivePlayPause
            }
            if let seekToLiveOnResume = mediaControlConfig["seekToLiveOnResume"] as? Bool {
                self.mediaControlConfig.seekToLiveOnResume = seekToLiveOnResume
            }
        }
    }
}
