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
    
    class func preloadType(_ type: String) -> Preload {
        switch type {
        case "none":
            return Preload.none
        case "auto":
            return Preload.auto
        case "metadata":
            return Preload.metadata
        default:
            return Preload.none
        }
    }
}
