// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import THEOplayerSDK

extension THEOplayerRCTView {
    func initBackgroundAudio() {
        guard let player = self.player else {
            return
        }
        player.backgroundPlaybackDelegate = self.backgroundAudioManager
    }
    
    func destroyBackgroundAudio() {
        guard let player = self.player else {
            return
        }
        player.backgroundPlaybackDelegate = DefaultBackgroundPlaybackDelegate()
    }
}

class DefaultBackgroundPlaybackDelegate: BackgroundPlaybackDelegate {
    func shouldContinueAudioPlaybackInBackground() -> Bool {
        return false
    }
}
