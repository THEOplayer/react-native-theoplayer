// THEOplayerRCTView+Ads.swift

import Foundation
import THEOplayerSDK

struct AdsConfig {
    var adSUIEnabled: Bool = true
    var adPreloadTypeString: String = "none"
}

#if os(iOS)

extension THEOplayerRCTView {
    
    func parseAdsConfig(configDict: NSDictionary) {
        if let adsConfig = configDict["ads"] as? NSDictionary {
            self.adsConfig.adSUIEnabled = adsConfig["uiEnabled"] as? Bool ?? true
            if let adPreloadType = adsConfig["preload"] as? String {
                self.adsConfig.adPreloadTypeString = adPreloadType
            }
        }
    }

#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(THEOplayerGoogleIMAIntegration)
    func playerAdsConfiguration() -> AdsConfiguration? {
        let googleBuilder = GoogleIMAConfigurationBuilder()
        googleBuilder.disableUI = !self.adsConfig.adSUIEnabled
        googleBuilder.enableBackgroundPlayback = true
        let googleIMAAdsConfiguration = googleBuilder.build()
        let daiBuilder = GoogleDAIAdsConfigurationBuilder()
        daiBuilder.disableUI = !self.adsConfig.adSUIEnabled
        daiBuilder.enableBackgroundPlayback = true
        let googleDaiAdsConfiguration = daiBuilder.build()
        return AdsConfiguration(showCountdown: self.adsConfig.adSUIEnabled,
                                preload: self.adPreloadType(),
                                googleIma: googleIMAAdsConfiguration,
                                googleDai: googleDaiAdsConfiguration)
    }
    
    private func adPreloadType() -> THEOplayerSDK.AdPreloadType {
        switch self.adsConfig.adPreloadTypeString {
        case "midroll-and-postroll":
            return THEOplayerSDK.AdPreloadType.MIDROLL_AND_POSTROLL
        case "none":
            return THEOplayerSDK.AdPreloadType.NONE
        default :
            return THEOplayerSDK.AdPreloadType.NONE
        }
    }
#else
    func playerAdsConfiguration() -> AdsConfiguration? { return nil }
#endif
    
}

#elseif os(tvOS)

extension THEOplayerRCTView {
    
    func parseAdsConfig(configDict: NSDictionary) {}
    
#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(THEOplayerGoogleIMAIntegration)
    func playerAdsConfiguration() -> AdsConfiguration? { return AdsConfiguration() }
#else
    func playerAdsConfiguration() -> AdsConfiguration? { return nil }
#endif
    
}

#endif
