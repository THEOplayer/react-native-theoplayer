// THEOplayerRCTPresentationModeEventHandler.swift

import Foundation
import THEOplayerSDK
import UIKit

public class THEOplayerRCTPresentationModeManager {
    // MARK: Members
    private weak var player: THEOplayer?
    private weak var view: UIView?
    var presentationModeContext = THEOplayerRCTPresentationModeContext()
    private var presentationMode: THEOplayerSDK.PresentationMode = .inline
    private var rnInlineMode: THEOplayerSDK.PresentationMode = .inline // while native player is inline, RN player can be inline or fullsceen
  
    private var containerView: UIView?                  // view containing the playerView and it's siblings (e.g. UI)
    private var inlineParentView: UIView?               // target view for inline representation
    private var movingChildVCs: [UIViewController] = []  // list of playerView's child VCs that need to be reparented while moving the playerView
        
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
    
    private func storeMovingVCs(for view: UIView) {
        if let viewController = view.findViewController() {
            viewController.children.forEach { childVC in
                self.movingChildVCs.append(childVC)
            }
        }
    }
    
    private func clearMovingVCs() {
        self.movingChildVCs = []
    }
    
    private func moveView(_ movingView: UIView, to targetView: UIView, with movingViewControllers: [UIViewController]) {
        // detach the moving viewControllers from their parent
        movingViewControllers.forEach { movedVC in
            movedVC.removeFromParent()
        }
        
        // move the actual view
        movingView.removeFromSuperview()
        targetView.addSubview(movingView)
        targetView.bringSubviewToFront(movingView)
        
        // attach the moving viewControllers to their new parent
        if let targetViewController = targetView.findViewController() {
            movingViewControllers.forEach { movedVC in
                targetViewController.addChild(movedVC)
                movedVC.didMove(toParent: targetViewController)
            }
        }
    }
    
    private func enterFullscreen() {
        self.containerView = self.view?.findParentViewOfType(RCTView.self)
        self.inlineParentView = self.containerView?.findParentViewOfType(RCTView.self)
        
        if let containerView = self.containerView,
           let fullscreenParentView = self.view?.findParentViewOfType(RCTRootContentView.self) {
            self.storeMovingVCs(for: containerView)
            self.moveView(containerView, to: fullscreenParentView, with: self.movingChildVCs)
        }
        self.rnInlineMode = .fullscreen
    }
    
    private func exitFullscreen() {
        if let containerView = self.containerView,
           let inlineParentView = self.inlineParentView {
            self.moveView(containerView, to: inlineParentView, with: self.movingChildVCs)
            self.clearMovingVCs()
        }
        self.rnInlineMode = .inline
    }
  
    func setPresentationModeFromRN(newPresentationMode: THEOplayerSDK.PresentationMode) {
        guard newPresentationMode != self.presentationMode else { return }
    
        // store old presentationMode
        let oldPresentationMode = self.presentationMode
        
        // set new presentationMode
        self.presentationMode = newPresentationMode
        
        // change prensentationMode
        switch oldPresentationMode {
        case .fullscreen:
            if newPresentationMode == .inline {
                self.exitFullscreen();                              // stay inline on Native player, go to inline layout on RN
            } else if newPresentationMode == .pictureInPicture {
                self.setNativePresentationMode(.pictureInPicture)   // go pip on Native player, keep fullscreen layout on RN
            }
        case .inline:
            if newPresentationMode == .fullscreen {
                self.enterFullscreen();                             // stay inline on Native player, go to fullscreen layout on RN
            } else if newPresentationMode == .pictureInPicture {
                self.setNativePresentationMode(.pictureInPicture)   // go pip on Native player, keep inline layout on RN
            }
        case .pictureInPicture:
            self.setNativePresentationMode(.inline)                 // always go inline on Native player,
            if newPresentationMode == .inline {
                if self.rnInlineMode == .fullscreen {
                    self.exitFullscreen()                           // and if required, switch to inline layout on RN,
                }
            } else if newPresentationMode == .fullscreen {
            if self.rnInlineMode == .inline {
                self.enterFullscreen()                              // and if required, switch to fullscreen layout on RN,
            }
        }
        default:
            break;
        }
        
        // notify the presentationMode change
        self.notifyPresentationModeChange(oldPresentationMode: oldPresentationMode, newPresentationMode: self.presentationMode)
    }
  
    func setPresentationModeFromNative(newPresentationMode: THEOplayerSDK.PresentationMode) {
        guard newPresentationMode != self.presentationMode else { return }
    
        // store old presentationMode
        let oldPresentationMode = self.presentationMode
    
        // set new presentationMode
        self.presentationMode = newPresentationMode
    
        // adjust presentationMode to RN layout
        if newPresentationMode == .inline {
             self.presentationMode = self.rnInlineMode
        }
    
        // notify the presentationMode change
        self.notifyPresentationModeChange(oldPresentationMode: oldPresentationMode, newPresentationMode: self.presentationMode)
    }
  
    private func setNativePresentationMode(_ presentationMode: THEOplayerSDK.PresentationMode) {
        guard let player = self.player else { return }
        player.presentationMode = presentationMode
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
                welf.setPresentationModeFromNative(newPresentationMode: event.presentationMode)
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
    
    func findViewController() -> UIViewController? {
        if let nextResponder = self.next as? UIViewController {
            return nextResponder
        } else if let nextResponder = self.next as? UIView {
            return nextResponder.findViewController()
        } else {
            return nil
        }
    }
}
