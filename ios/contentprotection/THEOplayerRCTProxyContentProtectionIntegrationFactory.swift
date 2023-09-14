//
//  THEOplayerRCTContentProtectionIntegrationFactory.swift
//  Theoplayer
//

import Foundation
import THEOplayerSDK

let PROXY_FACTORY_TAG: String = "[ProxyContentProtectionIntegrationFactory]"

class THEOplayerRCTProxyContentProtectionIntegrationFactory: THEOplayerSDK.ContentProtectionIntegrationFactory {
    private weak var contentProtectionAPI: THEOplayerRCTContentProtectionAPI?
    private var integrationId: String!
    private var keySystemId: String!
    
    init(contentProtectionAPI: THEOplayerRCTContentProtectionAPI, integrationId: String, keySystemId: String) {
        if DEBUG_CONTENT_PROTECTION_API { print(PROXY_FACTORY_TAG, "Proxy ContentProtectionIntegrationFactory initialised for \(integrationId)-\(keySystemId).") }
        self.contentProtectionAPI = contentProtectionAPI
        self.integrationId = integrationId
        self.keySystemId = keySystemId
    }
    
    func build(configuration: THEOplayerSDK.DRMConfiguration) -> ContentProtectionIntegration {
        if DEBUG_CONTENT_PROTECTION_API { print(PROXY_FACTORY_TAG, "Building proxy ContentProtectionIntegration for \(self.integrationId ?? "") - \(self.keySystemId ?? "").") }
        return THEOplayerRCTProxyContentProtectionIntegration(contentProtectionAPI: self.contentProtectionAPI,
                                                              integrationId: self.integrationId,
                                                              keySystemId: self.keySystemId,
                                                              drmConfig: configuration)
    }
}
