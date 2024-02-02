// THEOplayerRCTPresentationModeEventHandler.swift

import Foundation
import THEOplayerSDK

public class THEOplayerRCTPresentationModeManager {
    // MARK: Members
    private weak var player: THEOplayer?
    private weak var view: UIView?
    var presentationModeContext = THEOplayerRCTPresentationModeContext()
    var presentationMode: THEOplayerSDK.PresentationMode = .inline
    
    private var containerView: UIView?              // view containing the playerView and it's siblings (e.g. UI)
    private var fullscreenParentView: UIView?       // target view for fulllscreen representation
    private var inlineParentView: UIView?           // target view for inline representation
        
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
    func setPlayer(_ player: THEOplayer, view: UIView?) {
        self.player = player
        self.view = view
        
        // attach listeners
        self.attachListeners()
    }
    
    // MARK: - logic
    
    private func enterFullscreen() {
        self.containerView = self.view?.findParentViewOfType(RCTView.self)
        self.fullscreenParentView = self.view?.findParentViewOfType(RCTRootContentView.self)
        self.inlineParentView = self.containerView?.findParentViewOfType(RCTView.self)
        
        if let containerView = self.containerView,
           let fullscreenParentView = self.fullscreenParentView {
            containerView.removeFromSuperview()
            fullscreenParentView.addSubview(containerView)
            fullscreenParentView.bringSubviewToFront(containerView)
        }
    }
    
    private func exitFullscreen() {
        if let containerView = self.containerView,
           let inlineParentView = self.inlineParentView {
            containerView.removeFromSuperview()
            inlineParentView.addSubview(containerView)
            inlineParentView.bringSubviewToFront(containerView)
        }
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
                // get out of fullscreen via view reparenting
                self.exitFullscreen();
            } else if newPresentationMode == .pictureInPicture {
                // get out of fullscreen via view reparenting
                self.exitFullscreen();
                // get into pip
                player.presentationMode = .pictureInPicture
            }
        case .inline:
            if newPresentationMode == .fullscreen {
                // get into fullscreen via view reparenting
                self.enterFullscreen();
            } else if newPresentationMode == .pictureInPicture {
                // get into pip
                player.presentationMode = .pictureInPicture
            }
        case .pictureInPicture:
            if newPresentationMode == .fullscreen {
                // get out of pip
                player.presentationMode = .inline
                // get into fullscreen via view reparenting
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

// UIView extension to look for parent views
extension UIView {
    func findParentViewOfType<T: UIView>(_ viewType: T.Type) -> T? {
        var currentView: UIView? = self
        while let view = currentView {
            if let parentView = view.superview as? T {
                return parentView
            }
            currentView = view.superview
        }
        return nil
    }
}
