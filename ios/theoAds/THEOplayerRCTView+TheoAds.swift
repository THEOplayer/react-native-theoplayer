// THEOplayerRCTView+TheoAds.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerTheoAdsIntegration)
import THEOplayerTheoAdsIntegration
#endif

extension THEOplayerRCTView {
    func initTheoAdsIntegration() {
        guard let player = self.player else {
            return
        }
        
#if canImport(THEOplayerTheoAdsIntegration)
        // setup integration
        self.theoAdsIntegration = TheoAdsIntegration(player: player)
#endif
        
    }
}
