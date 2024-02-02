// THEOplayerRCTPresentationModeEventHandler.swift

import Foundation
import THEOplayerSDK

public class THEOplayerRCTPresentationModeEventHandler {
    // MARK: Members
    private weak var player: THEOplayer?
    private weak var presentationModeContext: THEOplayerRCTPresentationModeContext?
        
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
    func setPlayer(_ player: THEOplayer, presentationModeContext: THEOplayerRCTPresentationModeContext) {
        self.player = player
        self.presentationModeContext = presentationModeContext
        
        // attach listeners
        self.attachListeners()
    }
    
    // MARK: - attach/dettach main player Listeners
    private func attachListeners() {
        guard let player = self.player else {
            return
        }
        
        // PRESENTATION_MODE_CHANGE
        self.presentationModeChangeListener = player.addEventListener(type: PlayerEventTypes.PRESENTATION_MODE_CHANGE) { [weak self] event in
            if DEBUG_THEOPLAYER_EVENTS || true { PrintUtils.printLog(logText: "[NATIVE] Received PRESENTATION_MODE_CHANGE event from THEOplayer (to \(event.presentationMode._rawValue))") }
            if let forwardedPresentationModeChangeEvent = self?.onNativePresentationModeChange,
               let presentationModeContext = self?.presentationModeContext {
                forwardedPresentationModeChangeEvent(presentationModeContext.eventContextForNewPresentationMode(event.presentationMode))
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
