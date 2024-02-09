// THEOplayerRCTView+Ads.swift

import Foundation
import AVKit
import THEOplayerSDK

struct PipConfig {
    var canStartPictureInPictureAutomaticallyFromInline: Bool = false
}

extension THEOplayerRCTView: AVPictureInPictureControllerDelegate {
    
#if os(iOS)
    
    func playerPipConfiguration() -> PiPConfiguration {
        return PiPConfiguration(retainPresentationModeOnSourceChange: false,
                                nativePictureInPicture: true,
                                canStartPictureInPictureAutomaticallyFromInline: self.pipConfig.canStartPictureInPictureAutomaticallyFromInline,
                                requiresLinearPlayback: false)
    }
    
#elseif os(tvOS)
    
    func playerPipConfiguration() -> PiPConfiguration {
        return PiPConfiguration(retainPresentationModeOnSourceChange: false,
                                requiresLinearPlayback: false)
    }
    
#endif
    
    func initPip() {
        if let player = self.player,
           var pipController = player.pip {
            if #available(iOS 14.0, tvOS 14.0, *) {
                pipController.nativePictureInPictureDelegate = self
            }
        }
    }
    
    // MARK: - AVPictureInPictureControllerDelegate
    @available(tvOS 14.0, *)
    public func pictureInPictureControllerWillStartPictureInPicture(_ pictureInPictureController: AVPictureInPictureController) {
        self.presentationModeManager.presentationModeContext.pipContext = .PIP_CLOSED
        self.pipControlsManager.willStartPip()
    }
    
    @available(tvOS 14.0, *)
    public func pictureInPictureController(_ pictureInPictureController: AVPictureInPictureController, restoreUserInterfaceForPictureInPictureStopWithCompletionHandler completionHandler: @escaping (Bool) -> Void) {
        self.presentationModeManager.presentationModeContext.pipContext = .PIP_RESTORED
    }
}
