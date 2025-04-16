// THEOplayerRCTView+TheoAds.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerTHEOadsIntegration)
import THEOplayerTHEOadsIntegration
#endif

extension THEOplayerRCTView {
    func initTheoAdsIntegration() {
        guard let player = self.player else {
            return
        }
        
#if canImport(THEOplayerTHEOadsIntegration)
        // setup integration
        if #available(iOS 15.0, *) {
            self.theoAdsIntegration = THEOadsIntegrationFactory.createIntegration(on: player)
            player.addIntegration(self.theoAdsIntegration!)
        }
#endif
        
    }
}
