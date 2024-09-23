// THEOplayerRCTPresentationModeEventHandler.swift

import Foundation
import THEOplayerSDK
import UIKit

public class THEOplayerRCTPresentationModeManager {
    // MARK: Members
    private weak var player: THEOplayer?
    private weak var view: UIView?
    var presentationModeContext = THEOplayerRCTPresentationModeContext()
    var presentationMode: THEOplayerSDK.PresentationMode = .inline
    
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
    }
    
    private func exitFullscreen() {
        if let containerView = self.containerView,
           let inlineParentView = self.inlineParentView {
            self.moveView(containerView, to: inlineParentView, with: self.movingChildVCs)
            self.clearMovingVCs()
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
