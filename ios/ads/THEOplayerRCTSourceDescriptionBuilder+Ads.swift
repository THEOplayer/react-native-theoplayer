// THEOplayerRCTSourceDescriptionBuilder+Ads.swift

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

        if let ads = sourceData[SD_PROP_ADS] {
            adsDescriptions = []
            // case: array of ads objects
            if let adsDataArray = ads as? [[String:Any]] {
                for adsData in adsDataArray {
                    if let adDescription = THEOplayerRCTSourceDescriptionBuilder.buildSingleAdDescription(adsData) {
                        adsDescriptions?.append(adDescription)
                    } else {
                        if DEBUG_SOURCE_DESCRIPTION_BUILDER {
                            PrintUtils.printLog(logText: "[NATIVE] Could not create THEOplayer GoogleImaAdDescription from adsData array")
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
                    if DEBUG_SOURCE_DESCRIPTION_BUILDER {
                        PrintUtils.printLog(logText: "[NATIVE] Could not create THEOplayer GoogleImaAdDescription from adsData")
                    }
                    return nil
                }
            }
        }

        return adsDescriptions
    }

    /**
     Creates a THEOplayer AdDescription. This requires an ads property in the RN source description.
     - returns: a THEOplayerAdDescription
     */
    static func buildSingleAdDescription(_ adsData: [String:Any]) -> AdDescription? {
        if let integration = adsData[SD_PROP_INTEGRATION] as? String {
            switch integration {
            case "google-ima":
                return THEOplayerRCTSourceDescriptionBuilder.buildSingleGoogleIMAAdsDescription(adsData)
            case "theoads":
                return THEOplayerRCTSourceDescriptionBuilder.buildSingleTHEOadsDescription(adsData)
            default:
                if DEBUG_SOURCE_DESCRIPTION_BUILDER  { PrintUtils.printLog(logText: "[NATIVE] We currently require and only support the 'google-ima' or 'sgai' integration in the 'ads' description.") }
            }
        }
        return nil
    }
    
    /**
     Creates a THEOplayer GoogleImaAdDescription. This requires an ads property in the RN source description.
     - returns: a THEOplayer GoogleImaAdDescription
     */
    static func buildSingleGoogleIMAAdsDescription(_ adsData: [String:Any]) -> AdDescription? {
#if canImport(THEOplayerGoogleIMAIntegration)
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
            if DEBUG_SOURCE_DESCRIPTION_BUILDER  { PrintUtils.printLog(logText: "[NATIVE] AdDescription requires 'src' property in 'ads' description.") }
        }
#endif
        return nil
    }

    static func buildDAITypedSource(_ typedSourceData: [String:Any], contentProtection: MultiplatformDRMConfiguration?) -> TypedSource? {
#if canImport(THEOplayerGoogleIMAIntegration)
        // check for alternative Google DAI SSAI
        if let ssaiData = typedSourceData[SD_PROP_SSAI] as? [String:Any] {
            if let integration = ssaiData[SD_PROP_INTEGRATION] as? String,
               integration == SSAIIntegrationId.GoogleDAISSAIIntegrationID._rawValue {
                if let availabilityType = ssaiData[SD_PROP_AVAILABILITY_TYPE] as? String {
                    // build a GoogleDAIConfiguration
                    var googleDaiConfig: GoogleDAIConfiguration?
                    let authToken = ssaiData[SD_PROP_AUTH_TOKEN] as? String
                    let streamActivityMonitorID = ssaiData[SD_PROP_STREAM_ACTIVITY_MONITOR_ID] as? String
                    let adTagParameters = ssaiData[SD_PROP_AD_TAG_PARAMETERS] as? [String:String]
                    let apiKey = ssaiData[SD_PROP_APIKEY] as? String ?? ""
                    switch availabilityType {
                    case StreamType.vod._rawValue:
                        if let videoId = ssaiData[SD_PROP_VIDEOID] as? String,
                           let contentSourceID = ssaiData[SD_PROP_CONTENT_SOURCE_ID] as? String {
                            googleDaiConfig = GoogleDAIVodConfiguration(videoID: videoId,
                                                                        contentSourceID: contentSourceID,
                                                                        apiKey: apiKey,
                                                                        authToken: authToken,
                                                                        streamActivityMonitorID: streamActivityMonitorID,
                                                                        adTagParameters: adTagParameters)
                        }
                    case StreamType.live._rawValue:
                        if let assetKey = ssaiData[SD_PROP_ASSET_KEY] as? String {
                            googleDaiConfig = GoogleDAILiveConfiguration(assetKey: assetKey,
                                                                         apiKey: apiKey,
                                                                         authToken: authToken,
                                                                         streamActivityMonitorID: streamActivityMonitorID,
                                                                         adTagParameters: adTagParameters)
                        }
                    default:
                        if DEBUG_SOURCE_DESCRIPTION_BUILDER {
                            PrintUtils.printLog(logText: "[NATIVE] THEOplayer ssai 'availabilityType' must be 'live' or 'vod'")
                        }
                        return nil
                    }
                    // when valid, create a GoogleDAITypedSource from the GoogleDAIConfiguration
                    if let config = googleDaiConfig {
                        return GoogleDAITypedSource(src: "", type: "application/x-mpegurl",
                                                    drm: contentProtection, ssai: config)
                    }
                }
            }
        }
#endif

        return nil
    }

}
