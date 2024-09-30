// THEOplayerRCTView+BackgroundAudioConfig.swift

import Foundation
import THEOplayerSDK
import AVFAudio
import AVKit

struct BackgroundAudioConfig {
    var enabled: Bool = false
    var shouldResumeAfterInterruption: Bool = false
    var audioSessionMode: AVAudioSession.Mode = .moviePlayback
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
        NotificationCenter.default.removeObserver(self,
                                                  name: AVAudioSession.interruptionNotification,
                                                  object: AVAudioSession.sharedInstance())
    }
    
    public func shouldContinueAudioPlaybackInBackground() -> Bool {
        // Make sure to go to the background with updated NowPlayingInfo
        self.nowPlayingManager.updateNowPlaying()
        
        return self.backgroundAudioConfig.enabled
    }
    
    func updateInterruptionNotifications() {
        // Get the default notification center instance.
        if self.backgroundAudioConfig.shouldResumeAfterInterruption {
            NotificationCenter.default.addObserver(self,
                                                   selector: #selector(handleInterruption),
                                                   name: AVAudioSession.interruptionNotification,
                                                   object: AVAudioSession.sharedInstance())
        } else {
            NotificationCenter.default.removeObserver(self,
                                                      name: AVAudioSession.interruptionNotification,
                                                      object: AVAudioSession.sharedInstance())
        }
    }
    
    func updateAVAudioSessionMode() {
        do {
            THEOplayer.automaticallyManageAudioSession = (self.backgroundAudioConfig.audioSessionMode == .moviePlayback)
            try AVAudioSession.sharedInstance().setCategory(AVAudioSession.Category.playback, mode: self.backgroundAudioConfig.audioSessionMode)
            if self.backgroundAudioConfig.audioSessionMode != .moviePlayback {
                print("[NATIVE] AVAudioSession mode updated to \(self.backgroundAudioConfig.audioSessionMode.rawValue)")
            }
        } catch {
            print("[NATIVE] Unable to update AVAudioSession mode to \(self.backgroundAudioConfig.audioSessionMode.rawValue): ", error)
        }
    }
    
    @objc func handleInterruption(notification: Notification) {
        guard let userInfo = notification.userInfo,
              let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: typeValue) else {
            return
        }
        
        // Switch over the interruption type.
        switch type {
        case .began:
            // An interruption began. Update the UI as necessary.
            if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[INTERRUPTION] An interruption began")}
        case .ended:
            // An interruption ended. Resume playback, if appropriate.
            if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[INTERRUPTION] An interruption ended")}
            guard let optionsValue = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt else { return }
            let options = AVAudioSession.InterruptionOptions(rawValue: optionsValue)
            if options.contains(.shouldResume) {
                // An interruption ended. Resume playback.
                if let player = self.player {
                    if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[INTERRUPTION] Ended interruption should resume playback => play()")}
                    player.play()
                }
            } else {
                // An interruption ended. Don't resume playback.
                if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[INTERRUPTION] Ended interruption should not resume playback.")}
            }
        default: ()
        }
    }
}

struct DefaultBackgroundPlaybackDelegate: BackgroundPlaybackDelegate {
    func shouldContinueAudioPlaybackInBackground() -> Bool { false }
}
