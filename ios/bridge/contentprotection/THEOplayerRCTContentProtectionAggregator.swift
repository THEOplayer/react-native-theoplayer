// THEOplayerRCTContentProtectionAggregator.swift

import Foundation
import THEOplayerSDK

let DRM_PROP_INTEGRATION: String = "integration"
let DRM_PROP_INTEGRATION_ID: String = "integrationId"
let DRM_PROP_REQUEST_ID: String = "requestId"
let DRM_PROP_KEYSYSTEM_ID: String = "keySystemId"
let DRM_PROP_DRM_CONFIG: String = "drmConfig"
let DRM_PROP_URL: String = "url"
let DRM_PROP_METHOD: String = "method"
let DRM_PROP_HEADERS: String = "headers"
let DRM_PROP_INTEGRATION_PARAMS: String = "integrationParameters"
let DRM_PROP_FAIRPLAY: String = "fairplay"
let DRM_PROP_WIDEVINE: String = "widevine"
let DRM_PROP_LICENSE_URL: String = "licenseAcquisitionURL"
let DRM_PROP_CERTIFICATE_URL: String = "certificateURL"
let DRM_PROP_BASE64_BODY: String = "base64body"
let DRM_PROP_FAIRPLAY_SKD_URL: String = "fairplaySkdUrl"
let DRM_PROP_STATUS: String = "status"
let DRM_PROP_STATUS_TEXT: String = "statusText"
let DRM_PROP_REQUEST: String = "request"

let CPI_AGGREGATOR_TAG: String = "[ContentProtectionAggregator]"

class THEOplayerRCTContentProtectionAggregator {
    
    class func aggregateDrmConfiguration(integrationId: String, keySystemId: String, requestId: String, drmConfig: THEOplayerSDK.DRMConfiguration) -> [String:Any] {
        var aggregatedData: [String:Any] = THEOplayerRCTContentProtectionAggregator.bridgeData(integrationId: integrationId, keySystemId: keySystemId, requestId: requestId)
        
        var aggregatedDrmConfig: [String:Any] = [:]
        aggregatedDrmConfig[DRM_PROP_INTEGRATION] = drmConfig.customIntegrationId ?? "unknown"
        aggregatedDrmConfig[DRM_PROP_INTEGRATION_PARAMS] = drmConfig.integrationParameters
        if let multiDrmConfigCollection = drmConfig as? THEOplayerSDK.MultiplatformDRMConfiguration {
            let keySystemConfigurations: THEOplayerSDK.KeySystemConfigurationCollection = multiDrmConfigCollection.keySystemConfigurations
            if let fairplayConfig: THEOplayerSDK.KeySystemConfiguration = keySystemConfigurations.fairplay {
                aggregatedDrmConfig[DRM_PROP_FAIRPLAY] = THEOplayerRCTContentProtectionAggregator.aggregateKeySystemConfiguration(keySystemConfig: fairplayConfig)
            }
            if let widevineConfig: THEOplayerSDK.KeySystemConfiguration = keySystemConfigurations.widevine {
                aggregatedDrmConfig[DRM_PROP_WIDEVINE] = THEOplayerRCTContentProtectionAggregator.aggregateKeySystemConfiguration(keySystemConfig: widevineConfig)
            }
        } else if let fairplayDrmConfig = drmConfig as? THEOplayerSDK.FairPlayDRMConfiguration {
            aggregatedDrmConfig[DRM_PROP_FAIRPLAY] = THEOplayerRCTContentProtectionAggregator.aggregateKeySystemConfiguration(keySystemConfig: fairplayDrmConfig.fairplay)
        }
        aggregatedData[DRM_PROP_DRM_CONFIG] = aggregatedDrmConfig
        return aggregatedData
    }
    
    class func aggregateCertificateRequest(integrationId: String, keySystemId: String, requestId: String, certificateRequest: THEOplayerSDK.Request) -> [String:Any] {
        var aggregatedData: [String:Any] = THEOplayerRCTContentProtectionAggregator.bridgeData(integrationId: integrationId, keySystemId: keySystemId, requestId: requestId)
        aggregatedData[DRM_PROP_URL] = certificateRequest.url
        aggregatedData[DRM_PROP_METHOD] = certificateRequest.method
        aggregatedData[DRM_PROP_HEADERS] = certificateRequest.headers
        if let body = certificateRequest.body {
            aggregatedData[DRM_PROP_BASE64_BODY] = body.base64EncodedString()
        }
        return aggregatedData
    }
    
    class func aggregateCertificateResponse(integrationId: String, keySystemId: String, requestId: String, certificateResponse: THEOplayerSDK.Response) -> [String:Any] {
        var aggregatedData: [String:Any] = THEOplayerRCTContentProtectionAggregator.bridgeData(integrationId: integrationId, keySystemId: keySystemId, requestId: requestId)
        aggregatedData[DRM_PROP_URL] = certificateResponse.url
        aggregatedData[DRM_PROP_STATUS] = certificateResponse.status
        aggregatedData[DRM_PROP_STATUS_TEXT] = certificateResponse.statusText
        aggregatedData[DRM_PROP_HEADERS] = certificateResponse.headers
        aggregatedData[DRM_PROP_REQUEST] = THEOplayerRCTContentProtectionAggregator.aggregateCertificateRequest(integrationId:integrationId,
                                                                                                                keySystemId:keySystemId,
                                                                                                                requestId: requestId,
                                                                                                                certificateRequest: certificateResponse.request)
        aggregatedData[DRM_PROP_BASE64_BODY] = certificateResponse.body.base64EncodedString()
        return aggregatedData
    }
    
    class func aggregateLicenseRequest(integrationId: String, keySystemId: String, requestId: String, licenseRequest: THEOplayerSDK.Request) -> [String:Any] {
        var aggregatedData: [String:Any] = THEOplayerRCTContentProtectionAggregator.bridgeData(integrationId: integrationId, keySystemId: keySystemId, requestId: requestId)
        aggregatedData[DRM_PROP_URL] = licenseRequest.url
        aggregatedData[DRM_PROP_METHOD] = licenseRequest.method
        aggregatedData[DRM_PROP_HEADERS] = licenseRequest.headers
        aggregatedData[DRM_PROP_FAIRPLAY_SKD_URL] = (licenseRequest as? THEOplayerSDK.LicenseRequest)?.fairplaySkdUrl ?? ""
        if let body = licenseRequest.body {
            aggregatedData[DRM_PROP_BASE64_BODY] = body.base64EncodedString()
        }
        return aggregatedData
    }
    
    class func aggregateLicenseResponse(integrationId: String, keySystemId: String, requestId: String, licenseResponse: THEOplayerSDK.Response) -> [String:Any] {
        var aggregatedData: [String:Any] = THEOplayerRCTContentProtectionAggregator.bridgeData(integrationId: integrationId, keySystemId: keySystemId, requestId: requestId)
        aggregatedData[DRM_PROP_URL] = licenseResponse.url
        aggregatedData[DRM_PROP_STATUS] = licenseResponse.status
        aggregatedData[DRM_PROP_STATUS_TEXT] = licenseResponse.statusText
        aggregatedData[DRM_PROP_HEADERS] = licenseResponse.headers
        aggregatedData[DRM_PROP_REQUEST] = THEOplayerRCTContentProtectionAggregator.aggregateLicenseRequest(integrationId:integrationId,
                                                                                                            keySystemId:keySystemId,
                                                                                                            requestId: requestId,
                                                                                                            licenseRequest: licenseResponse.request)
        aggregatedData[DRM_PROP_BASE64_BODY] = licenseResponse.body.base64EncodedString()
        return aggregatedData
    }
    
    private class func bridgeData(integrationId: String, keySystemId: String, requestId: String) -> [String:Any] {
        var aggregatedData: [String:Any] = [:]
        aggregatedData[DRM_PROP_REQUEST_ID] = requestId
        aggregatedData[DRM_PROP_INTEGRATION_ID] = integrationId
        aggregatedData[DRM_PROP_KEYSYSTEM_ID] = keySystemId
        return aggregatedData
    }
    
    private class func aggregateKeySystemConfiguration(keySystemConfig: THEOplayerSDK.KeySystemConfiguration) -> [String:Any] {
        var aggregatedKeySystem: [String:Any] = [:]
        if let licenseURL = keySystemConfig.licenseAcquisitionURL?.absoluteString {
            aggregatedKeySystem[DRM_PROP_LICENSE_URL] = licenseURL
        }
        if let certificateURL = keySystemConfig.certificateURL?.absoluteString {
            aggregatedKeySystem[DRM_PROP_CERTIFICATE_URL] = certificateURL
        }
        return aggregatedKeySystem
    }
}
