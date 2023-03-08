// THEOplayerRCTView+Ads.swift

import Foundation
import THEOplayerSDK

struct PipConfig {
    var retainPresentationModeOnSourceChange: Bool = false              // external config
    var canStartPictureInPictureAutomaticallyFromInline: Bool = false   // external config
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
