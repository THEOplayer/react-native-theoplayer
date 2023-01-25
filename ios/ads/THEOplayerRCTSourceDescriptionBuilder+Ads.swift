// THEOplayerRCTSourceDescriptionBuilder.swift

import Foundation
import THEOplayerSDK
import UIKit

let SD_PROP_ADS: String = "ads"

extension THEOplayerRCTSourceDescriptionBuilder {

    /**
     Builds a THEOplayer SourceDescription that can be passed as a source for the THEOplayer.
     - returns: a THEOplayer TypedSource. In case of SSAI we  support GoogleDAITypedSource with GoogleDAIVodConfiguration or GoogleDAILiveConfiguration
     */
    static func buildAdDescriptions(_ sourceData: NSDictionary) -> [AdDescription]? {
        var adsDescriptions: [AdDescription]?

#if GOOGLE_IMA
        if let ads = sourceData[SD_PROP_ADS] {
            adsDescriptions = []
            // case: array of ads objects
            if let adsDataArray = ads as? [[String:Any]] {
                for adsData in adsDataArray {
                    if let adDescription = THEOplayerRCTSourceDescriptionBuilder.buildSingleAdDescription(adsData) {
                        adsDescriptions?.append(adDescription)
                    } else {
                        if DEBUG_SOURCE_DESCRIPTION_BUIDER {
                            print("[NATIVE] Could not create THEOplayer GoogleImaAdDescription from adsData array")
                        }
                        return nil
                    }
                }
            }
            // case: single ads object
            else if let adsData = ads as? [String:Any] {
                if let adDescription = THEOplayerRCTSourceDescriptionBuilder.buildSingleAdDescription(adsData) {
                    adsDescriptions?.append(adDescription)
                } else {
                    if DEBUG_SOURCE_DESCRIPTION_BUIDER {
                        print("[NATIVE] Could not create THEOplayer GoogleImaAdDescription from adsData")
                    }
                    return nil
                }
            }
        }
#endif
        
        return adsDescriptions
    }

#if GOOGLE_IMA
    /**
     Creates a THEOplayer GoogleImaAdDescription. This requires an ads property in the RN source description.
     - returns: a THEOplayer GoogleImaAdDescription
     */
    static func buildSingleAdDescription(_ adsData: [String:Any]) -> AdDescription? {
        if let integration = adsData[SD_PROP_INTEGRATION] as? String,
           integration == AdIntegration.google_ima._rawValue {
            // timeOffset can be Int or String: 10, "01:32:54.78", "1234.56", "start", "end", "10%", ...
            let timeOffset = adsData[SD_PROP_TIME_OFFSET] as? String ?? String(adsData[SD_PROP_TIME_OFFSET] as? Int ?? 0)
            var srcString: String?
            if let sourcesData = adsData[SD_PROP_SOURCES] as? [String:Any] {
                srcString = sourcesData[SD_PROP_SRC] as? String
            } else if let sourcesData = adsData[SD_PROP_SOURCES] as? String {
                srcString = sourcesData
            }
            if let src = srcString {
                return GoogleImaAdDescription(src: src, timeOffset: timeOffset)
            } else {
                if DEBUG_SOURCE_DESCRIPTION_BUIDER  { print("[NATIVE] AdDescription requires 'src' property in 'ads' description.") }
            }
        }
        if DEBUG_SOURCE_DESCRIPTION_BUIDER  { print("[NATIVE] We currently require and only support the 'google-ima' integration in the 'ads' description.") }
        return nil
    }
#endif

}
