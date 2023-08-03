// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

class THEOplayerRCTCachingParametersBuilder {
    static func buildCachingParameters(_ paramsData: NSDictionary) -> CachingParameters {
        var expirationDate: Date = Date(timeInterval: TimeInterval(30*60), since: Date()) // default expiration is after 30 minutes
        if let expirationDateTimestamp = paramsData[CACHETASK_PROP_PARAMETERS_EXPIRATION_DATE] as? Double {
            expirationDate = Date(timeIntervalSince1970: expirationDateTimestamp)
        }
        let bandWidth = paramsData[CACHETASK_PROP_PARAMETERS_EXPIRATION_DATE] as? Int
        let cachingParameters = CachingParameters(expirationDate: expirationDate, bandwidth: bandWidth)
        let preferredTrackSelection = paramsData[CACHETASK_PROP_PARAMETERS_TRACK_SELECTION] as? [String:Any]
        cachingParameters.preferredTrackSelection = THEOplayerRCTCachingParametersBuilder.buildPreferredTrackSelection(preferredTrackSelection)
        cachingParameters.allowsCellularAccess = paramsData[CACHETASK_PROP_PARAMETERS_CELLULAR] as? Bool ?? true
        return cachingParameters
    }
    
    static func buildPreferredTrackSelection(_ selectionData: [String:Any]?) -> CachingParametersTrackSelection {
        let builder = CachingParametersTrackSelectionBuilder()
        builder.audioTrackSelection = selectionData?[CACHETASK_PROP_PARAMETERS_AUDIO_TRACK_SELECTION] as? [String] ?? []
        builder.textTrackSelection = selectionData?[CACHETASK_PROP_PARAMETERS_TEXT_TRACK_SELECTION] as? [String] ?? []
        return builder.build()
    }
}
