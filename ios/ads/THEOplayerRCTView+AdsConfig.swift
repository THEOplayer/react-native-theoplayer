// THEOplayerRCTView+Ads.swift

import Foundation
import THEOplayerSDK

struct AdsConfig {
    var adSUIEnabled: Bool = true
    var adPreloadTypeString: String = "none"
    var adsImaConfig = AdsImaConfig()
}

struct AdsImaConfig {
    var maxRedirects: UInt = 4
    var enableDebugMode: Bool = false
    var ppid: String?
    var featureFlags: [String:String]?
    var autoPlayAdBreaks: Bool?
    var sessionID: String?
}

#if os(iOS)

extension THEOplayerRCTView {
    
    func parseAdsConfig(configDict: NSDictionary) {
        if let adsConfig = configDict["ads"] as? NSDictionary {
            self.adsConfig.adSUIEnabled = adsConfig["uiEnabled"] as? Bool ?? true
            if let adPreloadType = adsConfig["preload"] as? String {
                self.adsConfig.adPreloadTypeString = adPreloadType
            }
            if let adsImaConfig = adsConfig["ima"] as? NSDictionary {
                if let ppid = adsImaConfig["ppid"] as? String {
                    self.adsConfig.adsImaConfig.ppid = ppid
                }
                if let maxRedirects = adsImaConfig["maxRedirects"] as? UInt {
                    self.adsConfig.adsImaConfig.maxRedirects = maxRedirects
                }
                if let featureFlags = adsImaConfig["featureFlags"] as? [String:String] {
                    self.adsConfig.adsImaConfig.featureFlags = featureFlags
                }
                if let autoPlayAdBreaks = adsImaConfig["autoPlayAdBreaks"] as? Bool {
                    self.adsConfig.adsImaConfig.autoPlayAdBreaks = autoPlayAdBreaks
                }
                if let sessionID = adsImaConfig["sessionID"] as? String {
                    self.adsConfig.adsImaConfig.sessionID = sessionID
                }
                if let enableDebugMode = adsImaConfig["enableDebugMode"] as? Bool {
                    self.adsConfig.adsImaConfig.enableDebugMode = enableDebugMode
                }
            }
        }
    }

#if (GOOGLE_IMA || GOOGLE_DAI) || canImport(THEOplayerGoogleIMAIntegration)
    func playerAdsConfiguration() -> AdsConfiguration? {
        return AdsConfiguration(showCountdown: self.adsConfig.adSUIEnabled, preload: self.adPreloadType())
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
