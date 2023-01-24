// THEOplayerRCTView+Ads.swift

import Foundation
import THEOplayerSDK

#if canImport(GoogleIMAIntegration)
import GoogleIMAIntegration
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
#if canImport(GoogleIMAIntegration)
        let imaIntegration = GoogleIMAIntegrationFactory.createIntegration(on: player)
        player.addIntegration(imaIntegration)
#endif
    }
}
