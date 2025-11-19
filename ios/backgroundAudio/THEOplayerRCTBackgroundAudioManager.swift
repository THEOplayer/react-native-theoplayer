// TTHEOplayerRCTBackgroundAudioManager.swift

import Foundation
import THEOplayerSDK
import AVKit

class THEOplayerRCTBackgroundAudioManager: NSObject, BackgroundPlaybackDelegate {
    // MARK: Members
    private weak var player: THEOplayer?
    private weak var view: THEOplayerRCTView?
  
    // MARK: - player setup / breakdown
    func setPlayer(_ player: THEOplayer, view: THEOplayerRCTView?) {
        self.player = player
        self.view = view
    }
    
    // MARK: - destruction
    func destroy() {
        self.cancelInterruptionNotifications()
    }
  
    // MARK: - logic
    func shouldContinueAudioPlaybackInBackground() -> Bool {
        if let view = self.view {
            view.nowPlayingManager.updateNowPlaying()
            return view.backgroundAudioConfig.enabled
        }
        return false
    }
  
    func cancelInterruptionNotifications() {
        NotificationCenter.default.removeObserver(self,
                                                  name: AVAudioSession.interruptionNotification,
                                                  object: AVAudioSession.sharedInstance())
    }
  
    func updateInterruptionNotifications() {
        guard let view = self.view else { return }
      
        // Get the default notification center instance.
        if view.backgroundAudioConfig.shouldResumeAfterInterruption {
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
        guard let view = self.view else { return }
      
        do {
            THEOplayer.automaticallyManageAudioSession = (view.backgroundAudioConfig.audioSessionMode == .moviePlayback)
            try AVAudioSession.sharedInstance().setCategory(AVAudioSession.Category.playback, mode: view.backgroundAudioConfig.audioSessionMode)
            if view.backgroundAudioConfig.audioSessionMode != .moviePlayback {
                if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[NATIVE] AVAudioSession mode updated to \(view.backgroundAudioConfig.audioSessionMode.rawValue)") }
            }
        } catch {
            if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[NATIVE] Unable to update AVAudioSession mode to \(view.backgroundAudioConfig.audioSessionMode.rawValue): \(error)") }
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
            if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[NATIVE] An interruption began")}
        case .ended:
            // An interruption ended. Resume playback, if appropriate.
            if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[NATIVE] An interruption ended")}
            guard let optionsValue = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt else { return }
            let options = AVAudioSession.InterruptionOptions(rawValue: optionsValue)
            if options.contains(.shouldResume) {
                // An interruption ended. Resume playback.
                if let player = self.player {
                    if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[NATIVE] Ended interruption should resume playback => play()")}
                    player.play()
                }
            } else {
                // An interruption ended. Don't resume playback.
                if DEBUG_INTERRUPTIONS { PrintUtils.printLog(logText: "[NATIVE] Ended interruption should not resume playback.")}
            }
        default: ()
        }
    }
}
