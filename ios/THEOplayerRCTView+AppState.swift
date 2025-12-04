// THEOplayerRCTView+AppState.swift

import Foundation
import THEOplayerSDK
import MediaPlayer

extension THEOplayerRCTView {
    func setupAppStateObservers() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationDidEnterBackground),
            name: UIApplication.didEnterBackgroundNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillEnterForeground),
            name: UIApplication.willEnterForegroundNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(appWillTerminate),
            name: UIApplication.willTerminateNotification,
            object: nil
        )
    }
    
    func clearAppStateObservers() {
        NotificationCenter.default.removeObserver(self)
    }

    @objc private func applicationDidEnterBackground() {
        // When player was fullscreen:
        // - it either went to PiP before applicationDidEnterBackground was called. PiP always starts from fullscreen (startsAutomaticallyFromInline applies only to inline setup)
        // - or we push the player back to inline to prevent view index issues on app termination (e.g. when the app is killed from the app switcher while in fullscreen)
        if self.presentationModeManager.presentationMode == .fullscreen {
            if DEBUG_APPSTATE { PrintUtils.printLog(logText: "[NATIVE] presentationMode is fullscreen while backgrounding => back to inline.") }
            self.setPresentationMode(newPresentationMode: PresentationMode.inline)
        }
        
        self.isApplicationInBackground = true
    }

    @objc
    private func applicationWillEnterForeground() {
        self.isApplicationInBackground = false
    }
    
    @objc
    private func appWillTerminate() {
        if DEBUG_APPSTATE { PrintUtils.printLog(logText: "[NATIVE] App will terminate notification received.") }
        
        // Clear any now playing info
        if DEBUG_APPSTATE { PrintUtils.printLog(logText: "[NATIVE] Clearing nowPlayingInfo on app termination.") }
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
        
        if DEBUG_APPSTATE { PrintUtils.printLog(logText: "[NATIVE] Player is prepared for app termination.") }
    }
}
