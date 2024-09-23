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
        imaSettings.enableBackgroundPlayback = true
        if let ppid = self.adsConfig.adsImaConfig.ppid {
            imaSettings.ppid = ppid
        }
        #if os(iOS)
        if let featureFlags = self.adsConfig.adsImaConfig.featureFlags {
            imaSettings.featureFlags = featureFlags
        }
        #endif
        if let autoPlayAdBreaks = self.adsConfig.adsImaConfig.autoPlayAdBreaks {
            imaSettings.autoPlayAdBreaks = autoPlayAdBreaks
        }
        if let sessionID = self.adsConfig.adsImaConfig.sessionID {
            imaSettings.sessionID = sessionID
        }
        
        // setup ima render settings
        let imaRenderSettings = IMAAdsRenderingSettings()
        let disableUi = !self.adsConfig.adSUIEnabled
        if disableUi {
            imaRenderSettings.disableUi = disableUi
            imaRenderSettings.uiElements = []
        }
        imaRenderSettings.bitrate = self.adsConfig.adsImaConfig.bitrate
        if let allowedMimeTypes = self.adsConfig.allowedMimeTypes {
            imaRenderSettings.mimeTypes = allowedMimeTypes
        }
        
        // setup integration
        let imaIntegration = GoogleIMAIntegrationFactory.createIntegration(on: player, with: imaSettings)
        imaIntegration.renderingSettings = imaRenderSettings
        player.addIntegration(imaIntegration)
#endif
    }
}
