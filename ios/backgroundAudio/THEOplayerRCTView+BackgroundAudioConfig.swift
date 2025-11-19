// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import THEOplayerSDK
import AVFAudio

struct BackgroundAudioConfig {
    var enabled: Bool = false
    var stopOnBackground: Bool = false
    var shouldResumeAfterInterruption: Bool = false
    var audioSessionMode: AVAudioSession.Mode = .moviePlayback
}

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
