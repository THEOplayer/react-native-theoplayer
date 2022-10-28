//
//  THEOplayerRCTContentProtectionIntegrationFactory.swift
//  Theoplayer
//
//  Created by William van Haevre on 28/10/2022.
//

import Foundation
import THEOplayerSDK

let PROXY_FACTORY_TAG: String = "[ProxyContentProtectionIntegrationFactory] "

class THEOplayerRCTProxyContentProtectionIntegrationFactory: THEOplayerSDK.ContentProtectionIntegrationFactory {
    private weak var contentProtectionAPI: THEOplayerRCTContentProtectionAPI?
    private var integrationId: String!
    private var keySystemId: String!
    
    init(contentProtectionAPI: THEOplayerRCTContentProtectionAPI, integrationId: String, keySystemId: String) {
        self.contentProtectionAPI = contentProtectionAPI
        self.integrationId = integrationId
        self.keySystemId = keySystemId
    }
    
    func build(configuration: THEOplayerSDK.DRMConfiguration) -> ContentProtectionIntegration {
        return THEOplayerRCTProxyContentProtectionIntegration(contentProtectionAPI: self.contentProtectionAPI,
                                                              integrationId: self.integrationId,
                                                              keySystemId: self.keySystemId,
                                                              drmConfig: configuration)
    }
}
