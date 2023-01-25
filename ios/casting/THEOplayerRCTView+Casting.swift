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
#if canImport(GoogleCastIntegration)
        let castIntegration = CastIntegrationFactory.createCastIntegration(on: player, with: self.playerCastConfiguration())
        player.addIntegration(castIntegration)
#endif
    }
    
}
