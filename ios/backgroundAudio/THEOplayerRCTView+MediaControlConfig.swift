// THEOplayerRCTView+MediaControlConfig.swift

import Foundation
import THEOplayerSDK

let DEFAULT_SKIP_INTERVAL = 15
let DEFAULT_CONVERT_SKIP_TO_SEEK = false
let DEFAULT_ALLOW_LIVE_PLAY_PAUSE = true
let DEFAULT_SEEK_TO_LIVE_ON_RESUME = false
let DEFAULT_MEDIA_SESSION_ENABLED = true

struct MediaControlConfig {
    var mediaSessionEnabled: Bool = DEFAULT_MEDIA_SESSION_ENABLED
    var skipForwardInterval: Int = DEFAULT_SKIP_INTERVAL
    var skipBackwardInterval: Int = DEFAULT_SKIP_INTERVAL
    var convertSkipToSeek: Bool = DEFAULT_CONVERT_SKIP_TO_SEEK
    var allowLivePlayPause: Bool = DEFAULT_ALLOW_LIVE_PLAY_PAUSE
    var seekToLiveOnResume: Bool = DEFAULT_SEEK_TO_LIVE_ON_RESUME
}

extension THEOplayerRCTView {
    
    func parseMediaControlConfig(configDict: NSDictionary) {
        if let mediaControlConfig = configDict["mediaControl"] as? NSDictionary {
            // Build the config locally and assign it once, so the didSet observer (and its
            // remoteCommands/nowPlaying refresh) only fires a single time per parse.
            var newConfig = self.mediaControlConfig
            if let mediaSessionEnabled = mediaControlConfig["mediaSessionEnabled"] as? Bool {
                newConfig.mediaSessionEnabled = mediaSessionEnabled
            }
            if let skipForwardInterval = mediaControlConfig["skipForwardInterval"] as? Int {
                newConfig.skipForwardInterval = skipForwardInterval
            }
            if let skipBackwardInterval = mediaControlConfig["skipBackwardInterval"] as? Int {
                newConfig.skipBackwardInterval = skipBackwardInterval
            }
            if let convertSkipToSeek = mediaControlConfig["convertSkipToSeek"] as? Bool {
                newConfig.convertSkipToSeek = convertSkipToSeek
            }
            if let allowLivePlayPause = mediaControlConfig["allowLivePlayPause"] as? Bool {
                newConfig.allowLivePlayPause = allowLivePlayPause
            }
            if let seekToLiveOnResume = mediaControlConfig["seekToLiveOnResume"] as? Bool {
                newConfig.seekToLiveOnResume = seekToLiveOnResume
            }
            self.mediaControlConfig = newConfig
        }
    }
}
