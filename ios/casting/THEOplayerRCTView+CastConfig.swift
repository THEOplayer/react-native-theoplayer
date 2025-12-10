// THEOplayerRCTView+CastConfig.swift

import Foundation
import THEOplayerSDK

struct CastConfig {
    var castStrategyString: String = "manual"
    var useExperimentalPipeline: Bool = false
}

extension THEOplayerRCTView {
    
    func parseCastConfig(configDict: NSDictionary) {
        if let castConfig = configDict["cast"] as? NSDictionary {
            if let castStrategy = castConfig["strategy"] as? String {
                self.castConfig.castStrategyString = castStrategy
            }
        }
    }
    
#if os(iOS)
    func playerCastConfiguration() -> CastConfiguration? {
        return CastConfiguration(strategy: self.castStrategy())
    }
    
    func isCasting() -> Bool {
        if let cast = self.cast() {
            return cast.casting
        }
        return false
    }
    
    private func castStrategy() -> THEOplayerSDK.CastStrategy {
        switch self.castConfig.castStrategyString {
        case "auto":
            return THEOplayerSDK.CastStrategy.auto
        case "manual":
            return THEOplayerSDK.CastStrategy.manual
        case "disabled":
            return THEOplayerSDK.CastStrategy.disabled
        default :
            return THEOplayerSDK.CastStrategy.manual
        }
    }
#else
    func isCasting() -> Bool { return false }
#endif
}
