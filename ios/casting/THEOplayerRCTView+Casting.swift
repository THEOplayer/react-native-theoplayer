// THEOplayerRCTView+Casting.swift

import Foundation
import THEOplayerSDK
#if canImport(GoogleCastIntegration)
import GoogleCastIntegration
#endif

extension THEOplayerRCTView {
    
#if os(iOS)
    func cast() -> Cast? {
        guard let player = self.player else {
            return nil
        }
        return player.cast
    }
#endif
    
    func initCastIntegration() {
        guard let player = self.player else {
            return
        }
#if os(iOS) && canImport(GoogleCastIntegration)
        if let castConfiguration = self.playerCastConfiguration() {
            let castIntegration = CastIntegrationFactory.createCastIntegration(on: player, with: castConfiguration)
            player.addIntegration(castIntegration)
        }
#endif
    }
    
}
