// THEOplayerRCTView+CmcdConfig.swift

import Foundation
import THEOplayerSDK

struct CmcdConfig {
    var externalSessionId: String?
    var userId: String?
    var eventEndpoints: [[String: Any]]?
}

extension THEOplayerRCTView {

    func parseCmcdConfig(configDict: NSDictionary) {
        if let cmcdDict = configDict["cmcd"] as? NSDictionary {
            self.cmcdConfig.externalSessionId = cmcdDict["externalSessionId"] as? String
            self.cmcdConfig.userId = cmcdDict["userId"] as? String
            self.cmcdConfig.eventEndpoints = cmcdDict["eventEndpoints"] as? [[String: Any]]
        }
    }

    func playerCmcdConfiguration() -> CMCDConfiguration? {
        let config = self.cmcdConfig
        if config.externalSessionId == nil && config.userId == nil && config.eventEndpoints == nil {
            return nil
        }
        let endpoints = config.eventEndpoints?.compactMap { dict -> CMCDEndpointConfiguration? in
            guard let url = dict["url"] as? String else { return nil }
            return CMCDEndpointConfiguration(url: url)
        }
        return CMCDConfiguration(
            externalSessionId: config.externalSessionId,
            userId: config.userId,
            eventEndpoints: endpoints
        )
    }
}
