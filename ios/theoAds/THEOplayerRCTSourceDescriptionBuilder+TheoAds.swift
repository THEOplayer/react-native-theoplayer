// THEOplayerRCTSourceDescriptionBuilder+TheoAds.swift

import Foundation
import THEOplayerSDK
import UIKit

#if canImport(THEOplayerTheoAdsIntegration)
import THEOplayerTheoAdsIntegration
#endif

extension THEOplayerRCTSourceDescriptionBuilder {

    /**
     Creates a THEOplayer GoogleImaAdDescription. This requires an ads property in the RN source description.
     - returns: a THEOplayer GoogleImaAdDescription
     */
    static func buildSingleTheoAdsDescription(_ adsData: [String:Any]) -> AdDescription? {
#if canImport(THEOplayerTheoAdsIntegration)
        //...
        let networkCode = adsData[SD_PROP_NETWORK_CODE] as? String
        let customAssetKey = adsData[SD_PROP_CUSTOM_ASSET_KEY] as? String
        var backdropDoubleBox: URL?
        if let backdropDoubleBoxString = adsData[SD_PROP_BACKDROP_DOUBLE_BOX] as? String {
            backdropDoubleBox = URL(string: backdropDoubleBoxString)
        }
        var backdropLShape: URL?
        if let backdropLShapeString = adsData[SD_PROP_BACKDROP_L_SHAPE] as? String {
            backdropLShape = URL(string: backdropLShapeString)
        }
        return TheoAdDescription(networkCode: networkCode,
                                 customAssetKey: customAssetKey,
                                 backdropDoubleBox: backdropDoubleBox,
                                 backdropLShape: backdropLShape,
                                 overrideLayout: nil)
#else
        return nil
#endif

    }
}
