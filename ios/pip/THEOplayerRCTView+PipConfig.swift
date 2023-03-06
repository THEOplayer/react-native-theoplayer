// THEOplayerRCTView+Ads.swift

import Foundation
import AVKit
import THEOplayerSDK

struct PipConfig {
    var retainPresentationModeOnSourceChange: Bool = false              // external config
    var canStartPictureInPictureAutomaticallyFromInline: Bool = false   // external config
    var requiresLinearPlayback: Bool = false                            // external config
}

extension THEOplayerRCTView: AVPictureInPictureControllerDelegate {
    
#if os(iOS)
    
    func playerPipConfiguration() -> PiPConfiguration? {
        return PiPConfiguration(retainPresentationModeOnSourceChange: self.pipConfig.retainPresentationModeOnSourceChange,
                                nativePictureInPicture: true,
                                canStartPictureInPictureAutomaticallyFromInline: self.pipConfig.canStartPictureInPictureAutomaticallyFromInline)
    }
    
#elseif os(tvOS)
    
    func playerPipConfiguration() -> PiPConfiguration? {
        return PiPConfiguration(retainPresentationModeOnSourceChange: self.pipConfig.retainPresentationModeOnSourceChange)
    }
    
#endif
    
    func initPip() {
        if let player = self.player,
           var pipController = player.pip {
            if #available(iOS 14.0, *) {
                pipController.nativePictureInPictureDelegate = self
            }
        }
    }
    
    public func pictureInPictureControllerWillStartPictureInPicture(_ pictureInPictureController: AVPictureInPictureController) {
        self.presentationModeContext.pipContext = .PIP_CLOSED
        if #available(iOS 14.0, *) {
            pictureInPictureController.requiresLinearPlayback = self.pipConfig.requiresLinearPlayback
        }
    }
    
    public func pictureInPictureController(_ pictureInPictureController: AVPictureInPictureController, restoreUserInterfaceForPictureInPictureStopWithCompletionHandler completionHandler: @escaping (Bool) -> Void) {
        self.presentationModeContext.pipContext = .PIP_RESTORED
    }
}
