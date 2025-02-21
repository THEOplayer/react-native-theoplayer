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

  
    private weak var containerView: UIView?                  // view containing the playerView and it's siblings (e.g. UI)
    private weak var inlineParentView: UIView?               // target view for inline representation
        
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
    
    func validateLayout() {
        if self.presentationMode == .fullscreen,
           let containerView = self.containerView {
            // When in fullscreen, assure the moved view has a (0, 0) origin.
            containerView.frame = CGRect(x: 0, y: 0, width: containerView.frame.width, height: containerView.frame.height)
        }
    }
    
    // MARK: - logic
    private func movingVCs(for view: UIView) -> [UIViewController] {
        var viewControllers: [UIViewController] = []
        if let viewController = view.findViewController() {
            viewController.children.forEach { childVC in
                if childVC.view.isDescendant(of: view) {
                    viewControllers.append(childVC)
                }
            }
        }
        return viewControllers
    }

    private func moveView(_ movingView: UIView, to targetView: UIView) {
        // detach the moving viewControllers from their parent
        let movingViewControllers = self.movingVCs(for: movingView)
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
        self.containerView = self.view?.findParentViewOfType(["RCTView", "RCTViewComponentView"])
        self.inlineParentView = self.containerView?.superview
        
        // move the player
        if let containerView = self.containerView,
           let fullscreenParentView = self.view?.findParentViewOfType(["RCTRootContentView", "RCTRootComponentView"])  {
            self.moveView(containerView, to: fullscreenParentView)

            // start hiding home indicator
            setHomeIndicatorHidden(true)
        }
        self.rnInlineMode = .fullscreen
    }
    
    private func exitFullscreen() {
        // stop hiding home indicator
        setHomeIndicatorHidden(false)
      
        // move the player
        if let containerView = self.containerView,
           let inlineParentView = self.inlineParentView {
            self.moveView(containerView, to: inlineParentView)
        }
        self.rnInlineMode = .inline
    }

    private func setHomeIndicatorHidden(_ hidden: Bool) {
#if os(iOS)
        if let fullscreenParentView = self.view?.findParentViewOfType(["RCTRootContentView", "RCTRootComponentView"]),
           let customRootViewController = fullscreenParentView.findViewController() as? HomeIndicatorViewController {
              customRootViewController.prefersAutoHidden = hidden
              customRootViewController.setNeedsUpdateOfHomeIndicatorAutoHidden()
        }
#endif
    }
  
    func setPresentationModeFromRN(newPresentationMode: THEOplayerSDK.PresentationMode) {
        guard newPresentationMode != self.presentationMode else { return }
        
        // change prensentationMode
        switch self.presentationMode {
        case .fullscreen:
            if newPresentationMode == .inline {
                self.exitFullscreen()                               // stay inline on Native player, go to inline layout on RN
                self.notifyPresentationModeChange(oldPresentationMode: self.presentationMode, newPresentationMode: newPresentationMode)
                self.presentationMode = newPresentationMode
            } else if newPresentationMode == .pictureInPicture {
                self.setNativePresentationMode(.pictureInPicture)   // go pip on Native player, keep fullscreen layout on RN
            }
        case .inline:
            if newPresentationMode == .fullscreen {
                self.enterFullscreen()                              // stay inline on Native player, go to fullscreen layout on RN
                self.notifyPresentationModeChange(oldPresentationMode: self.presentationMode, newPresentationMode: newPresentationMode)
                self.presentationMode = newPresentationMode
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
                    self.enterFullscreen()                          // and if required, switch to fullscreen layout on RN,
                }
            }
        default:
            break;
        }
    }
  
    func setPresentationModeFromNative(newPresentationMode: THEOplayerSDK.PresentationMode) {
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
    func findParentViewOfType(_ viewTypeNames: [String]) -> UIView? {
        var currentView: UIView? = self
        while let view = currentView {
            if let parentView = view.superview {
                let instanceTypeName = String(describing: type(of: parentView))
                if viewTypeNames.contains(instanceTypeName) {
                    return parentView
                }
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
