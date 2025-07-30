// THEOplayerRCTAdAdapter.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerTHEOliveIntegration)
import THEOplayerTHEOliveIntegration
#endif

let PROP_ENDPOINT_HESP_SRC: String = "hespSrc"
let PROP_ENDPOINT_HLS_SRC: String = "hlsSrc"
let PROP_ENDPOINT_CDN: String = "cdn"
let PROP_ENDPOINT_AD_SRC: String = "adSrc"
let PROP_ENDPOINT_WEIGHT: String = "weight"
let PROP_ENDPOINT_PRIORITY: String = "priority"
let PROP_ENDPOINT_CONTENT_PROTECTION: String = "contentProtection"

class THEOplayerRCTTHEOliveEventAdapter {

#if canImport(THEOplayerTHEOliveIntegration)
    class func fromEndpoint(endpoint: THEOplayerTHEOliveIntegration.EndpointAPI) -> [String:Any] {
        var endpointData: [String:Any] = [:]
        
        if let hespSrc = endpoint.hespSrc {
            endpointData[PROP_ENDPOINT_HESP_SRC] = hespSrc
        }
        if let hlsSrc = endpoint.hlsSrc {
            endpointData[PROP_ENDPOINT_HLS_SRC] = hlsSrc
        }
        if let cdn = endpoint.cdn {
            endpointData[PROP_ENDPOINT_CDN] = cdn
        }
        if let adSrc = endpoint.adSrc {
            endpointData[PROP_ENDPOINT_AD_SRC] = adSrc
        }
        //if let contentProtection = endpoint.contentProtection {
            // TODO: not yet available on native iOS SDK.
        //}
        endpointData[PROP_ENDPOINT_WEIGHT] = endpoint.weight
        endpointData[PROP_ENDPOINT_PRIORITY] = endpoint.priority
        return endpointData
    }
#endif
    
}
