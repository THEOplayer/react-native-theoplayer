// THEOplayerRCTTypeUtils.swift

import Foundation
import THEOplayerSDK

let NAN_VALUE: Double = -1.0
let POS_INF_VALUE: Double = -2.0

class THEOplayerRCTTypeUtils {
    class func encodeInfNan(_ value: Double) -> Double {
        if value.isNaN {
            return NAN_VALUE
        }
        if value.isInfinite {
            return POS_INF_VALUE
        }
        return value
    }
    
    class func preloadTypeFromString(_ type: String) -> Preload {
        switch type {
        case "none":
            return Preload.none
        case "auto":
            return Preload.auto
#if os(iOS)
        case "metadata":
            return Preload.metadata
#endif
        default:
            return Preload.none
        }
    }
    
    class func presentationModeFromString(_ mode: String) -> PresentationMode {
        switch mode {
        case "inline":
            return PresentationMode.inline
        case "picture-in-picture":
            return PresentationMode.pictureInPicture
        case "fullscreen":
            return PresentationMode.fullscreen
        default:
            return PresentationMode.inline
        }
    }
    
    class func presentationModeToString(_ mode: PresentationMode) -> String {
        switch mode {
        case PresentationMode.inline:
            return "inline"
        case PresentationMode.pictureInPicture:
            return "picture-in-picture"
        case PresentationMode.fullscreen:
            return "fullscreen"
        default:
            return "inline"
        }
    }
}
