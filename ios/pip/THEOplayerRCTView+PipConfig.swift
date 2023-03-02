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
    
    func parsePipConfig(configDict: NSDictionary) {
        if let pipConfig = configDict["pip"] as? NSDictionary {
            self.pipConfig.retainPresentationModeOnSourceChange = pipConfig["retainPresentationModeOnSourceChange"] as? Bool ?? false
            self.pipConfig.canStartPictureInPictureAutomaticallyFromInline = pipConfig["canStartPictureInPictureAutomaticallyFromInline"] as? Bool ?? false
        }
    }

    func playerPipConfiguration() -> PiPConfiguration? {
        return PiPConfiguration(retainPresentationModeOnSourceChange: self.pipConfig.retainPresentationModeOnSourceChange,
                                nativePictureInPicture: true,
                                canStartPictureInPictureAutomaticallyFromInline: self.pipConfig.canStartPictureInPictureAutomaticallyFromInline)
    }
}

#elseif os(tvOS)

extension THEOplayerRCTView {
    
    func parsePipConfig(configDict: NSDictionary) {
        if let pipConfig = configDict["pip"] as? NSDictionary {
            self.pipConfig.retainPresentationModeOnSourceChange = pipConfig["retainPresentationModeOnSourceChange"] as? Bool ?? false
        }
    }
    
    func playerPipConfiguration() -> PiPConfiguration? {
        return PiPConfiguration(retainPresentationModeOnSourceChange: self.pipConfig.retainPresentationModeOnSourceChange)
    }
    
}

#endif
