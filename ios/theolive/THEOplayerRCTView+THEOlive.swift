// THEOplayerRCTView+THEOlive.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerTHEOliveIntegration)
@_spi(Experimental) import THEOplayerTHEOliveIntegration
#endif

extension THEOplayerRCTView {
    func initTHEOliveIntegration() {
        guard let player = self.player else {
            return
        }
        
#if canImport(THEOplayerTHEOliveIntegration)
        let THEOliveConfig = THEOliveConfiguration(externalSessionId: self.theoliveConfig.externalSessionId,
                                                   experimentalHespContentPlayer: !self.theoliveConfig.useLegacyTHEOlive)
        
        if DEBUG_THEOLIVE_API {
            PrintUtils.printLog(logText: "[NATIVE] Using \(self.theoliveConfig.useLegacyTHEOlive ? "legacy" : "new") theolive pipeline.")
        }
        
        self.THEOliveIntegration = THEOliveIntegrationFactory.createIntegration(with: THEOliveConfig)
        player.addIntegration(self.THEOliveIntegration!)
#endif
    }
}
