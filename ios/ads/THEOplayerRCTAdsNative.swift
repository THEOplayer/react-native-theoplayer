// THEOplayerRCTAdsNative.swift

import Foundation
import THEOplayerSDK

class NativeAd: THEOplayerSDK.Ad {
    /** A reference to the `AdBreak` of which the ad is a part of.*/
    var adBreak: AdBreak
    /** An array of `CompanionAd`s associated to the ad, if available within the same Creatives element.*/
    var companions: [THEOplayerSDK.CompanionAd] = []
    /** Either 'linear' or 'nonlinear', depending on the concrete implementer.*/
    var type: String = ""
    /** The identifier of the creative, provided in the VAST-file.*/
    var id: String? = nil
    /** When the Ad can be skipped, in seconds.*/
    var skipOffset: Int? = nil
    /**The URI of the the ad content.*/
    var resourceURI: String? = nil
    /** The width of the advertisement, in pixels.*/
    var width: Int? = nil
    /** The height of the advertisement, in pixels.*/
    var height: Int? = nil
    /** Whether the ad is slate or not */
    var isSlate: Bool
    /** The kind of the ad integration.*/
    var integration: THEOplayerSDK.AdIntegrationKind
    /** The duration of the LinearAd, as provided by the VAST file, in seconds.*/
    var duration: Int? = 0
    /** The url that redirects to the website of the advertiser.*/
    var clickThrough: String? = nil
    /**The type of custom ad integration.*/
    var customIntegration: String? = nil
    
    init(adBreak: AdBreak, companions: [THEOplayerSDK.CompanionAd], type: String, id: String? = nil, skipOffset: Int? = nil, resourceURI: String? = nil, width: Int? = nil, height: Int? = nil, isSlate: Bool = false, integration: THEOplayerSDK.AdIntegrationKind, duration: Int? = 0, clickThrough: String?, customIntegration: String?) {
        self.adBreak = adBreak
        self.companions = companions
        self.type = type
        self.id = id
        self.skipOffset = skipOffset
        self.resourceURI = resourceURI
        self.width = width
        self.height = height
        self.isSlate = isSlate
        self.integration = integration
        self.duration = duration
        self.clickThrough = clickThrough
        self.customIntegration = customIntegration
    }
}

class NativeLinearAd: NativeAd, THEOplayerSDK.LinearAd {
    /** An array of mediafiles, which provides some meta data retrieved from the VAST file.*/
    var mediaFiles: [THEOplayerSDK.MediaFile] = []
    
    init(adBreak: AdBreak, companions: [THEOplayerSDK.CompanionAd], type: String, id: String? = nil, skipOffset: Int? = nil, resourceURI: String? = nil, width: Int? = nil, height: Int? = nil, integration: THEOplayerSDK.AdIntegrationKind, duration: Int? = 0, clickThrough: String? = nil, customIntegration: String? = nil, mediaFiles: [THEOplayerSDK.MediaFile] = []) {
        
        self.mediaFiles = mediaFiles
        
        super.init(adBreak:adBreak,
                   companions: companions,
                   type: type,
                   id: id,
                   skipOffset: skipOffset,
                   resourceURI: resourceURI,
                   width: width,
                   height: height,
                   integration: integration,
                   duration: duration,
                   clickThrough: clickThrough,
                   customIntegration: customIntegration)
    }
}

class NativeLinearGoogleImaAd: NativeLinearAd, THEOplayerSDK.GoogleImaAd {
    /** The source ad server information included in the ad response.*/
    var adSystem: String? = nil
    /** The identifier of the selected creative for the ad.*/
    var creativeId: String? = nil
    /** The list of wrapper ad identifiers as specified in the VAST response.*/
    var wrapperAdIds: [String] = []
    /** The list of wrapper ad systems as specified in the VAST response.*/
    var wrapperAdSystems: [String] = []
    /** The list of wrapper creative identifiers.*/
    var wrapperCreativeIds: [String] = []
    /** The bitrate of the currently playing creative as listed in the VAST response.*/
    var vastMediaBitrate: Int = 0
    /** The list of universal ad ID information of the selected creative for the ad.*/
    var universalAdIds: [UniversalAdId] = []
    /** The String representing custom trafficking parameters from the VAST response.*/
    var traffickingParameters: String = ""
    
    init(adBreak: AdBreak, companions: [THEOplayerSDK.CompanionAd], type: String, id: String? = nil, skipOffset: Int? = nil, resourceURI: String? = nil, width: Int? = nil, height: Int? = nil, integration: THEOplayerSDK.AdIntegrationKind, duration: Int? = 0, clickThrough: String? = nil, customIntegration: String? = nil, mediaFiles: [THEOplayerSDK.MediaFile] = [], adSystem: String? = nil, creativeId: String? = nil, wrapperAdIds: [String], wrapperAdSystems: [String], wrapperCreativeIds: [String], vastMediaBitrate: Int, universalAdIds: [UniversalAdId], traffickingParameters: String) {
        self.adSystem = adSystem
        self.creativeId = creativeId
        self.wrapperAdIds = wrapperAdIds
        self.wrapperAdSystems = wrapperAdSystems
        self.wrapperCreativeIds = wrapperCreativeIds
        self.vastMediaBitrate = vastMediaBitrate
        self.universalAdIds = universalAdIds
        self.traffickingParameters = traffickingParameters
        
        super.init(adBreak: adBreak,
                   companions: companions,
                   type: type,
                   id: id,
                   skipOffset: skipOffset,
                   resourceURI: resourceURI,
                   width: width,
                   height: height,
                   integration:integration,
                   duration: duration,
                   clickThrough: clickThrough,
                   customIntegration: customIntegration,
                   mediaFiles: mediaFiles)
    }
}

class NativeAdBreak: THEOplayerSDK.AdBreak {
    /** An array of all the ads that are available in the current AdBreak.*/
    var ads: [Ad] = []
    /**Indicates the duration of the ad break, in seconds.*/
    var maxDuration: Int = -1
    /** Indicates the remaining duration of the ad break, in seconds.*/
    var maxRemainingDuration: Double = -1
    /** The time offset at which point the content will be paused to play the ad break, in seconds.*/
    var timeOffset: Int = 0
    /** The kind of the ad integration.*/
    var integration: THEOplayerSDK.AdIntegrationKind
    /**The type of custom ad integration.*/
    var customIntegration: String? = nil
    
    init(ads: [Ad], maxDuration: Int, maxRemainingDuration: Double, timeOffset: Int, integration: THEOplayerSDK.AdIntegrationKind, customIntegration: String? = nil) {
        self.ads = ads
        self.maxDuration = maxDuration
        self.maxRemainingDuration = maxRemainingDuration
        self.timeOffset = timeOffset
        self.integration = integration
        self.customIntegration = customIntegration
    }
}

class NativeCompanionAd: THEOplayerSDK.CompanionAd {
    /** An identifier of the element in which the companion ad should be appended, if available.*/
    var adSlotId: String? = nil
    /** An alternative description for the companion ad.*/
    var altText: String? = nil
    /** The website of the advertisement.*/
    var clickThrough: String? = nil
    /** The height of the companion ad, in pixels.*/
    var height: Int
    /** The URI of the ad content.*/
    var resourceURI: String? = nil
    /** The width of the companion ad, in pixels.*/
    var width: Int
    /** The type of the companion ad.*/
    var type: String = ""
    
    init(adSlotId: String? = nil, altText: String? = nil, clickThrough: String? = nil, height: Int, resourceURI: String? = nil, width: Int, type: String) {
        self.adSlotId = adSlotId
        self.altText = altText
        self.clickThrough = clickThrough
        self.height = height
        self.resourceURI = resourceURI
        self.width = width
        self.type = type
    }
}

class NativeUniversalAdId: THEOplayerSDK.UniversalAdId {
    /** The Universal Ad identifier of the selected creative for the ad.*/
    var adIdValue: String = ""
    /** The registry associated with cataloging the UniversalAdId of the selected creative for the ad.*/
    var adIdRegistry: String = ""
    
    init(adIdValue: String, adIdRegistry: String) {
        self.adIdValue = adIdValue
        self.adIdRegistry = adIdRegistry
    }
}
