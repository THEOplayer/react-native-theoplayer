// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import THEOplayerSDK

struct BackgroundAudioConfig {
    var enabled: Bool = false
    var shouldResumeAfterInterruption: Bool = false
}

extension THEOplayerRCTView: BackgroundPlaybackDelegate {

    func initBackgroundAudio() {
        self.player?.backgroundPlaybackDelegate = self
    }
    
    func destroyBackgroundAudio() {
        guard let player = self.player else {
            return
        }
        player.backgroundPlaybackDelegate = DefaultBackgroundPlaybackDelegate()
    }
    
    public func shouldContinueAudioPlaybackInBackground() -> Bool {
        // Make sure to go to the background with updated NowPlayingInfo
        self.nowPlayingManager.updateNowPlaying()
        
        return self.backgroundAudioConfig.enabled
    }
}

struct DefaultBackgroundPlaybackDelegate: BackgroundPlaybackDelegate {
    func shouldContinueAudioPlaybackInBackground() -> Bool { false }
}
