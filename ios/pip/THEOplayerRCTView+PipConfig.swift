// THEOplayerRCTView+Ads.swift

import Foundation
import AVKit
import THEOplayerSDK

enum PipContext: String {
    case PIP_CLOSED = "pipClosed"
    case PIP_RESTORED = "pipRestored"
}

struct PipConfig {
    var retainPresentationModeOnSourceChange: Bool = false              // external config
    var canStartPictureInPictureAutomaticallyFromInline: Bool = false   // external config
    var requiresLinearPlayback: Bool = false                            // external config
    var context: PipContext = .PIP_CLOSED                               // internal config, indicating last PIP closure context
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
        self.pipConfig.context = .PIP_CLOSED
        if #available(iOS 14.0, *) {
            pictureInPictureController.requiresLinearPlayback = self.pipConfig.requiresLinearPlayback
        }
    }
    
    public func pictureInPictureController(_ pictureInPictureController: AVPictureInPictureController, restoreUserInterfaceForPictureInPictureStopWithCompletionHandler completionHandler: @escaping (Bool) -> Void) {
        self.pipConfig.context = .PIP_RESTORED
    }
}
