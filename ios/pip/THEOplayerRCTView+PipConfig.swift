// THEOplayerRCTView+Ads.swift

import Foundation
import THEOplayerSDK

struct PipConfig {
    var retainPresentationModeOnSourceChange: Bool = false
    var canStartPictureInPictureAutomaticallyFromInline: Bool = false
    var requiresLinearPlayback: Bool = false
}

#if os(iOS)

extension THEOplayerRCTView {

    func playerPipConfiguration() -> PiPConfiguration? {
        return PiPConfiguration(retainPresentationModeOnSourceChange: self.pipConfig.retainPresentationModeOnSourceChange,
                                nativePictureInPicture: true,
                                canStartPictureInPictureAutomaticallyFromInline: self.pipConfig.canStartPictureInPictureAutomaticallyFromInline)
    }
}

#elseif os(tvOS)

extension THEOplayerRCTView {
    
    func playerPipConfiguration() -> PiPConfiguration? {
        return PiPConfiguration(retainPresentationModeOnSourceChange: self.pipConfig.retainPresentationModeOnSourceChange)
    }
    
}

#endif
