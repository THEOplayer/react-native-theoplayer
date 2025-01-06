// THEOplayerRCTView+Ads.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerGoogleIMAIntegration)
import GoogleInteractiveMediaAds
#endif

struct AdsConfig {
    var adSUIEnabled: Bool = true
    var adsImaConfig = AdsImaConfig(maxRedirects: 4, enableDebugMode: false)
    var allowedMimeTypes: [String]?
}

struct AdsImaConfig {
    var maxRedirects: UInt = 4
    var enableDebugMode: Bool = false
    var ppid: String?
    var featureFlags: [String:String]?
    var autoPlayAdBreaks: Bool?
    var sessionID: String?
    var bitrate: Int
    var adLoadTimeout: TimeInterval?
    
    init(maxRedirects: UInt, enableDebugMode: Bool, ppid: String? = nil, featureFlags: [String : String]? = nil, autoPlayAdBreaks: Bool? = nil, sessionID: String? = nil, bitrate: Int? = -1, adLoadTimeout: TimeInterval? = nil) {
        self.maxRedirects = maxRedirects
        self.enableDebugMode = enableDebugMode
        self.ppid = ppid
        self.featureFlags = featureFlags
        self.autoPlayAdBreaks = autoPlayAdBreaks
        self.sessionID = sessionID
        self.adLoadTimeout = adLoadTimeout
#if canImport(THEOplayerGoogleIMAIntegration)
        self.bitrate = bitrate ?? kIMAAutodetectBitrate
#else
        self.bitrate = bitrate ?? -1
#endif
    }
}

#if os(iOS)

extension THEOplayerRCTView {
    
    func parseAdsConfig(configDict: NSDictionary) {
        if let adsConfig = configDict["ads"] as? NSDictionary {
            self.adsConfig.adSUIEnabled = adsConfig["uiEnabled"] as? Bool ?? true
            self.adsConfig.allowedMimeTypes = adsConfig["allowedMimeTypes"] as? [String]
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
                if let bitrate = adsImaConfig["bitrate"] as? Int {
                    self.adsConfig.adsImaConfig.bitrate = bitrate
                }
                if let adLoadTimeout = adsImaConfig["adLoadTimeout"] as? TimeInterval {
                    self.adsConfig.adsImaConfig.adLoadTimeout = adLoadTimeout
                }
            }
        }
    }
}

#elseif os(tvOS)

extension THEOplayerRCTView {
    
    func parseAdsConfig(configDict: NSDictionary) {}
    
}

#endif
