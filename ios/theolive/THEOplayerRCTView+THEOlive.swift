// THEOplayerRCTView+THEOlive.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerTHEOliveIntegration)
import THEOplayerTHEOliveIntegration
#endif

extension THEOplayerRCTView {
    func initTHEOliveIntegration() {
        guard let player = self.player else {
            return
        }
        
#if canImport(THEOplayerTHEOliveIntegration)
        let THEOliveConfig = THEOliveConfiguration(externalSessionId: self.theoliveConfig.externalSessionId,
                                                   discoveryUrl: self.theoliveConfig.discoveryUrl)
        
        self.THEOliveIntegration = THEOliveIntegrationFactory.createIntegration(with: THEOliveConfig)
        player.addIntegration(self.THEOliveIntegration!)
#endif
    }
}
