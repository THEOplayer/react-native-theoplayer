// THEOplayerRCTView+UIConfig.swift

import Foundation
import THEOplayerSDK

struct UIConfig {
    var language: String = "en"
}

extension THEOplayerRCTView {

    func parseUIConfig(configDict: NSDictionary) {
        if let uiConfig = configDict["ui"] as? NSDictionary {
            if let uiLanguage = uiConfig["language"] as? String {
                self.uiConfig.language = uiLanguage
            }
        }
    }

}
