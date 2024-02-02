// THEOplayerRCTPresentationModeEventHandler.swift

import Foundation
import THEOplayerSDK

public class THEOplayerRCTPresentationModeManager {
    // MARK: Members
    private weak var player: THEOplayer?
    var presentationModeContext = THEOplayerRCTPresentationModeContext()
    var presentationMode: THEOplayerSDK.PresentationMode = .inline
        
    // MARK: Events
    var onNativePresentationModeChange: RCTDirectEventBlock?
    
    // MARK: player Listeners
    private var presentationModeChangeListener: EventListener?
    
    // MARK: - destruction
    func destroy() {
        // dettach listeners
        self.dettachListeners()
    }
    
    // MARK: - player setup / breakdown
    func setPlayer(_ player: THEOplayer) {
        self.player = player
        
        // attach listeners
        self.attachListeners()
    }
    
    // MARK: - logic
    
    private func enterFullscreen() {
        print("[PRESENTATIONMODE_CHANGE] PLAYER IS REPARENTED TO FULLSCREEN")
    }
    
    private func exitFullscreen() {
        print("[PRESENTATIONMODE_CHANGE] PLAYER IS REPARENTED BACK TO INLINE")
    }
    
    func setPresentationMode(newPresentationMode: THEOplayerSDK.PresentationMode) {
        guard newPresentationMode != self.presentationMode, let player = self.player else { return }
        
        // store old presentationMode
        let oldPresentationMode = self.presentationMode
        
        // set new presentationMode
        self.presentationMode = newPresentationMode
        
        // change prensentationMode
        switch oldPresentationMode {
        case .fullscreen:
            if newPresentationMode == .inline {
                // get out of fullscreen via RCTView reparenting
                self.exitFullscreen();
            } else if newPresentationMode == .pictureInPicture {
                // get out of fullscreen via RCTView reparenting
                self.exitFullscreen();
                // get into pip
                player.presentationMode = .pictureInPicture
            }
        case .inline:
            if newPresentationMode == .fullscreen {
                // get into fullscreen via RCTView reparenting
                self.enterFullscreen();
            } else if newPresentationMode == .pictureInPicture {
                // get into pip
                player.presentationMode = .pictureInPicture
            }
        case .pictureInPicture:
            if newPresentationMode == .fullscreen {
                // get out of pip
                player.presentationMode = .inline
                // get into fullscreen via RCTView reparenting
                self.enterFullscreen();
            } else if newPresentationMode == .inline {
                // get into pip
                player.presentationMode = .inline
            }
        default:
            break;
        }
        
        // notify the presentationMode change
        self.notifyPresentationModeChange(oldPresentationMode: oldPresentationMode, newPresentationMode: newPresentationMode)
    }
    
    private func notifyPresentationModeChange(oldPresentationMode: THEOplayerSDK.PresentationMode, newPresentationMode: THEOplayerSDK.PresentationMode) {
        // update the current presentationMode
        self.presentationMode = newPresentationMode
        
        if let forwardedPresentationModeChangeEvent = self.onNativePresentationModeChange {
            forwardedPresentationModeChangeEvent(presentationModeContext.eventContextForNewPresentationMode(oldPresentationMode: oldPresentationMode, newPresentationMode: newPresentationMode))
        }
    }
    
    // MARK: - attach/dettach main player Listeners
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // PRESENTATION_MODE_CHANGE
        self.presentationModeChangeListener = player.addEventListener(type: PlayerEventTypes.PRESENTATION_MODE_CHANGE) { [weak self] event in
            if let welf = self {
                if DEBUG_THEOPLAYER_EVENTS || true { PrintUtils.printLog(logText: "[NATIVE] Received PRESENTATION_MODE_CHANGE event from THEOplayer (to \(event.presentationMode._rawValue))") }
                welf.setPresentationMode(newPresentationMode: event.presentationMode)
            }
        }
        if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] PresentationModeChange listener attached to THEOplayer") }
    }
    
    private func dettachListeners() {
        guard let player = self.player else {
            return
        }
        
        // PRESENTATION_MODE_CHANGE
        if let presentationModeChangeListener = self.presentationModeChangeListener {
            player.removeEventListener(type: PlayerEventTypes.PRESENTATION_MODE_CHANGE, listener: presentationModeChangeListener)
            if DEBUG_EVENTHANDLER { PrintUtils.printLog(logText: "[NATIVE] PresentationModeChange listener dettached from THEOplayer") }
        }
    }
}
