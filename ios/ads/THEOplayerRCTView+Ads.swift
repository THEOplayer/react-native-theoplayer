// THEOplayerRCTView+Ads.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerGoogleIMAIntegration)
import THEOplayerGoogleIMAIntegration
import GoogleInteractiveMediaAds
#endif

extension THEOplayerRCTView {
    
    func ads() -> Ads? {
        guard let player = self.player else {
            return nil
        }
        return player.ads
    }
    
    func initAdsIntegration() {
        guard let player = self.player else {
            return
        }
#if canImport(THEOplayerGoogleIMAIntegration)
        // prepare imaSettings
        let imaSettings = IMASettings()
        imaSettings.language = self.uiConfig.language
        imaSettings.maxRedirects = self.adsConfig.adsImaConfig.maxRedirects
        imaSettings.enableDebugMode = self.adsConfig.adsImaConfig.enableDebugMode
        imaSettings.playerType = "THEOplayer"
        imaSettings.playerVersion = THEOplayer.version
        if let ppid = self.adsConfig.adsImaConfig.ppid {
            imaSettings.ppid = ppid
        }
        if let featureFlags = self.adsConfig.adsImaConfig.featureFlags {
            imaSettings.featureFlags = featureFlags
        }
        if let autoPlayAdBreaks = self.adsConfig.adsImaConfig.autoPlayAdBreaks {
            imaSettings.autoPlayAdBreaks = autoPlayAdBreaks
        }
        if let sessionID = self.adsConfig.adsImaConfig.sessionID {
            imaSettings.sessionID = sessionID
        }
        
        // setup integration
        let imaIntegration = GoogleIMAIntegrationFactory.createIntegration(on: player, with: imaSettings)
        player.addIntegration(imaIntegration)
#endif
    }
}
