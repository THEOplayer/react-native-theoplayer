// THEOplayerRCTAdAggregator.swift

import Foundation
import THEOplayerSDK

let PROP_AD_INTEGRATION: String = "integration"
let PROP_AD_TYPE: String = "type"
let PROP_AD_ID: String = "id"
let PROP_AD_BREAK: String = "adBreak"
let PROP_AD_DURATION: String = "duration"
let PROP_AD_SKIP_OFFSET: String = "skipOffset"
let PROP_AD_COMPANIONS: String = "companions"
let PROP_AD_CLICK_THROUGH: String = "clickThrough"
let PROP_AD_RESOURCE_URI: String = "resourceURI"
let PROP_AD_UNIVERSAL_AD_IDS: String = "universalAdIds"
let PROP_GOOGLE_AD_AD_SYSTEM: String = "adSystem"
let PROP_GOOGLE_AD_CREATIVE_ID: String = "creativeId"
let PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS_STRING: String = "traffickingParametersString"
let PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS: String = "traffickingParameters"
let PROP_GOOGLE_AD_BITRATE: String = "bitrate"
let PROP_GOOGLE_AD_WIDTH: String = "width"
let PROP_GOOGLE_AD_HEIGHT: String = "height"
let PROP_GOOGLE_AD_CONTENT_TYPE: String = "contentType"
let PROP_GOOGLE_AD_ID_REGISTRY: String = "adIdRegistry"
let PROP_GOOGLE_AD_ID_VALUE: String = "adIdValue"
let PROP_GOOGLE_AD_WRAPPER_AD_IDS: String = "wrapperAdIds"
let PROP_GOOGLE_AD_WRAPPER_AD_SYSTEMS: String = "wrapperAdSystems"
let PROP_GOOGLE_AD_WRAPPER_CREATIVE_IDS: String = "wrapperCreativeIds"
let PROP_ADBREAK_MAX_DURATION: String = "maxDuration"
let PROP_ADBREAK_TIME_OFFSET: String = "timeOffset"
let PROP_ADBREAK_MAX_REMAINING_DURATION: String = "maxRemainingDuration"
let PROP_ADBREAK_ADS: String = "ads"
let PROP_ADBREAK_INTEGRATION: String = "integration"
let PROP_COMPANION_AD_SLOT_ID: String = "adSlotId"
let PROP_COMPANION_ALT_TEXT: String = "altText"
let PROP_COMPANION_CLICK_THROUGH: String = "clickThrough"
let PROP_COMPANION_WIDTH: String = "width"
let PROP_COMPANION_HEIGHT: String = "height"
let PROP_COMPANION_RESOURCE_URI: String = "resourceURI"

class THEOplayerRCTAdAggregator {

#if ADS && (GOOGLE_IMA || GOOGLE_DAI)
    class func aggregateAd(ad: Ad, processAdBreak: Bool = true) -> [String:Any] {
        var adData: [String:Any] = [:]
        adData[PROP_AD_INTEGRATION] = ad.integration._rawValue
        adData[PROP_AD_TYPE] = ad.type
        if let adId = ad.id {
            adData[PROP_AD_ID] = adId
        }
        if let resourceURI = ad.resourceURI {
            adData[PROP_AD_RESOURCE_URI] = resourceURI
        }
        if let skipOffset = ad.skipOffset {
            adData[PROP_AD_SKIP_OFFSET] = (skipOffset == -1) ? skipOffset : skipOffset * 1000 // sec -> msec
        }
        if processAdBreak,
           let adBreak = ad.adBreak {
            adData[PROP_AD_BREAK] = THEOplayerRCTAdAggregator.aggregateAdBreak(adBreak: adBreak)
        }
        
#if os(iOS)
        adData[PROP_AD_COMPANIONS] = THEOplayerRCTAdAggregator.aggregateCompanionAds(companionAds: ad.companions)
#endif
        
        adData[PROP_AD_UNIVERSAL_AD_IDS] = []

        // Add additional properties for Linear Ads
        if let linearAd = ad as? LinearAd {
            if let adDuration = linearAd.duration {
                adData[PROP_AD_DURATION] = adDuration * 1000 // sec -> msec
            }
        }

        // Add additional properties for NonLinear Ads
#if os(iOS)
        if let nonLinearAd = ad as? NonLinearAd {
            if let adClickThrough = nonLinearAd.clickThrough {
                adData[PROP_AD_CLICK_THROUGH] = adClickThrough
            }
        }
#endif

        // Add additional properties for GoogleIma Ads
        if let googleImaAd = ad as? GoogleImaAd {
            if let adSystem = googleImaAd.adSystem {
                adData[PROP_GOOGLE_AD_AD_SYSTEM] = adSystem
            }
            if let creativeId = googleImaAd.creativeId {
                adData[PROP_GOOGLE_AD_CREATIVE_ID] = creativeId
            }
            let traffickingParametersString = googleImaAd.traffickingParameters
            adData[PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS_STRING] = traffickingParametersString
            if let traffickingParameters = THEOplayerRCTAdAggregator.aggregateTraffickingParameters(traffickingParametersString: traffickingParametersString) {
                adData[PROP_GOOGLE_AD_TRAFFICKING_PARAMETERS] = traffickingParameters
            }
            adData[PROP_GOOGLE_AD_BITRATE] = googleImaAd.vastMediaBitrate
            if let width = googleImaAd.width {
                adData[PROP_GOOGLE_AD_WIDTH] = width
            }
            if let height = googleImaAd.height {
                adData[PROP_GOOGLE_AD_HEIGHT] = height
            }
            if !googleImaAd.universalAdIds.isEmpty {
                var adIdList: [[String:Any]] = []
                for adId in googleImaAd.universalAdIds {
                    var adIdData: [String:Any] = [:]
                    adIdData[PROP_GOOGLE_AD_ID_REGISTRY] = adId.adIdRegistry
                    adIdData[PROP_GOOGLE_AD_ID_VALUE] = adId.adIdValue
                    adIdList.append(adIdData)
                }
                adData[PROP_AD_UNIVERSAL_AD_IDS] = adIdList
            }
            adData[PROP_GOOGLE_AD_WRAPPER_AD_IDS] = googleImaAd.wrapperAdIds
            adData[PROP_GOOGLE_AD_WRAPPER_AD_SYSTEMS] = googleImaAd.wrapperAdSystems
            adData[PROP_GOOGLE_AD_WRAPPER_CREATIVE_IDS] = googleImaAd.wrapperCreativeIds
        }

        return adData
    }

    class func aggregateAdBreak(adBreak: AdBreak) -> [String:Any] {
        var adBreakData: [String:Any] = [:]
        adBreakData[PROP_ADBREAK_MAX_DURATION] = adBreak.maxDuration * 1000 // sec -> msec
        adBreakData[PROP_ADBREAK_TIME_OFFSET] = adBreak.timeOffset * 1000 // sec -> msec
        adBreakData[PROP_ADBREAK_MAX_REMAINING_DURATION] = adBreak.maxRemainingDuration * 1000.0 // sec -> msec
        // process adds when adbreak contains them
        if !adBreak.ads.isEmpty {
            var adList: [[String:Any]] = []
            for ad in adBreak.ads {
                adList.append(THEOplayerRCTAdAggregator.aggregateAd(ad: ad, processAdBreak: false))
            }
            adBreakData[PROP_ADBREAK_ADS] = adList
            if adList.count > 0,
               let integration = adList[0][PROP_AD_INTEGRATION] {
                adBreakData[PROP_ADBREAK_INTEGRATION] = integration
            }
        }
        return adBreakData
    }

    class private func aggregateCompanionAds(companionAds: [CompanionAd?]) -> [[String:Any]] {
        var companionAdsData: [[String:Any]] = []
        for cAd in companionAds {
            if let companionAd = cAd {
                var companionAdData: [String:Any] = [:]
                companionAdData[PROP_COMPANION_AD_SLOT_ID] = companionAd.adSlotId ?? ""
                companionAdData[PROP_COMPANION_ALT_TEXT] = companionAd.altText ?? ""
                companionAdData[PROP_COMPANION_CLICK_THROUGH] = companionAd.clickThrough ?? ""
                companionAdData[PROP_COMPANION_WIDTH] = companionAd.width ?? 0
                companionAdData[PROP_COMPANION_HEIGHT] = companionAd.height ?? 0
                companionAdData[PROP_COMPANION_RESOURCE_URI] = companionAd.resourceURI ?? ""
                companionAdsData.append(companionAdData)
            }
        }
        return companionAdsData
    }

    class private func aggregateTraffickingParameters(traffickingParametersString: String) -> [String:Any]? {
        if let data = traffickingParametersString.data(using: .utf8) {
            return try? JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? [String:Any]
        }
        return nil
    }
#endif

}
