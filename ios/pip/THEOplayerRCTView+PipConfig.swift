// THEOplayerRCTView+Ads.swift

import Foundation
import AVKit
import THEOplayerSDK

struct PipConfig {
    var retainPresentationModeOnSourceChange: Bool = false              // external config
    var canStartPictureInPictureAutomaticallyFromInline: Bool = false   // external config
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
            if #available(iOS 14.0, tvOS 14.0, *) {
                pipController.nativePictureInPictureDelegate = self
            }
        }
    }
    
    // MARK: - AVPictureInPictureControllerDelegate
    @available(tvOS 14.0, *)
    public func pictureInPictureControllerWillStartPictureInPicture(_ pictureInPictureController: AVPictureInPictureController) {
        self.presentationModeContext.pipContext = .PIP_CLOSED
        self.pipControlsManager.setNativePictureInPictureController(pictureInPictureController)
    }
    
    @available(tvOS 14.0, *)
    public func pictureInPictureControllerWillStopPictureInPicture(_ pictureInPictureController: AVPictureInPictureController) {
        self.pipControlsManager.setNativePictureInPictureController(nil)
    }
    
    @available(tvOS 14.0, *)
    public func pictureInPictureController(_ pictureInPictureController: AVPictureInPictureController, restoreUserInterfaceForPictureInPictureStopWithCompletionHandler completionHandler: @escaping (Bool) -> Void) {
        self.presentationModeContext.pipContext = .PIP_RESTORED
    }
}
