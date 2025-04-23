// THEOplayerRCTSourceDescriptionBuilder+TheoAds.swift

import Foundation
import THEOplayerSDK
import UIKit

#if canImport(THEOplayerTHEOadsIntegration)
import THEOplayerTHEOadsIntegration
#endif

extension THEOplayerRCTSourceDescriptionBuilder {

    /**
     Creates a THEOplayer GoogleImaAdDescription. This requires an ads property in the RN source description.
     - returns: a THEOplayer GoogleImaAdDescription
     */
    static func buildSingleTheoAdsDescription(_ adsData: [String:Any]) -> AdDescription? {
#if canImport(THEOplayerTHEOadsIntegration)
        //...
        let networkCode = adsData[SD_PROP_NETWORK_CODE] as? String
        let customAssetKey = adsData[SD_PROP_CUSTOM_ASSET_KEY] as? String
        let sseEndpoint = adsData[SD_PROP_SSE_ENDPOINT] as? String
        var backdropDoubleBox: URL?
        if let backdropDoubleBoxString = adsData[SD_PROP_BACKDROP_DOUBLE_BOX] as? String {
            backdropDoubleBox = URL(string: backdropDoubleBoxString)
        }
        var backdropLShape: URL?
        if let backdropLShapeString = adsData[SD_PROP_BACKDROP_L_SHAPE] as? String {
            backdropLShape = URL(string: backdropLShapeString)
        }
        var overrideLayout: THEOAdDescription.LayoutOverride?
        if let overrideLayoutString = adsData[SD_PROP_OVERRIDE_LAYOUT] as? String {
            switch overrideLayoutString {
                case "single":
                    overrideLayout = .single
                case "l-shape":
                    overrideLayout = .lShape
                case "double":
                    overrideLayout = .double
                default:
                    overrideLayout = nil
            }
        }
        var overrideAdSrc: URL?
        if let overrideAdSrcString = adsData[SD_PROP_OVERRIDE_AD_SRC] as? String {
            overrideAdSrc = URL(string: overrideAdSrcString)
        }
        let adTagParameters = adsData[SD_PROP_AD_TAG_PARAMETERS] as? [String:String]
        let useId3 = adsData[SD_PROP_USE_ID3] as? Bool
        let retrievePodIdURI = adsData[SD_PROP_RETRIEVE_POD_ID_URI] as? String
        return THEOAdDescription(networkCode: networkCode,
                                 customAssetKey: customAssetKey,
                                 backdropDoubleBox: backdropDoubleBox,
                                 backdropLShape: backdropLShape,
                                 overrideLayout: overrideLayout,
                                 overrideAdSrc: overrideAdSrc,
                                 adTagParameters: adTagParameters,
                                 useId3: useId3,
                                 sseEndpoint: sseEndpoint,
                                 retrievePodIdURI: retrievePodIdURI)
#else
        return nil
#endif

    }
}
