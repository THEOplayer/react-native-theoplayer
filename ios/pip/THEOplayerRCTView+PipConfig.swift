// THEOplayerRCTView+Ads.swift

import Foundation
import AVKit
import THEOplayerSDK

struct PipConfig {
    var canStartPictureInPictureAutomaticallyFromInline: Bool = false
}

extension THEOplayerRCTView: AVPictureInPictureControllerDelegate {
    
    func playerPipConfiguration() -> PiPConfiguration {
        let builder = PiPConfigurationBuilder()
        builder.retainPresentationModeOnSourceChange = false
        builder.requiresLinearPlayback = false
#if os(iOS)
        builder.nativePictureInPicture = true
        builder.canStartPictureInPictureAutomaticallyFromInline = self.pipConfig.canStartPictureInPictureAutomaticallyFromInline
#endif
        return builder.build()
    }
    
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
