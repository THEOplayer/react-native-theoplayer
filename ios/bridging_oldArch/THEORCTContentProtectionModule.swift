//
//  THEORCTContentProtectionModule.swift
//

@objc(THEORCTContentProtectionModule)
class THEORCTContentProtectionModule: RCTEventEmitter {
    let contentProtectionAPI = THEOplayerRCTContentProtectionAPI()
    
    override init() {
        super.init()
        self.contentProtectionAPI.sendEvent = self.sendEvent
    }
    
    override static func moduleName() -> String! {
        return "THEORCTContentProtectionModule"
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override func supportedEvents() -> [String]! {
        return ["onBuildIntegration",
                "onCertificateRequest",
                "onCertificateResponse",
                "onLicenseRequest",
                "onLicenseResponse",
                "onExtractFairplayContentId"
        ]
    }
    
    @objc(registerContentProtectionIntegration:keySystemId:)
    func registerContentProtectionIntegration(_ integrationId: String, keySystemId: String) -> Void {
        self.contentProtectionAPI
            .registerContentProtectionIntegration(
                integrationId: integrationId,
                keySystemId: keySystemId
            )
    }
    
    @objc(onBuildProcessed:)
    func onBuildProcessed(_ result: NSDictionary) -> Void {
        self.contentProtectionAPI.onBuildProcessed(result: result)
    }
    
    @objc(onCertificateRequestProcessedAsRequest:)
    func onCertificateRequestProcessedAsRequest(_ result: NSDictionary) -> Void {
        self.contentProtectionAPI.onCertificateRequestProcessedAsRequest(result: result)
    }
    
    @objc(onCertificateRequestProcessedAsCertificate:)
    func onCertificateRequestProcessedAsCertificate(_ result: NSDictionary) -> Void {
        self.contentProtectionAPI.onCertificateRequestProcessedAsCertificate(result: result)
    }
    
    @objc(onCertificateResponseProcessed:)
    func onCertificateResponseProcessed(_ result: NSDictionary) -> Void {
        self.contentProtectionAPI.onCertificateResponseProcessed(result: result)
    }
    
    @objc(onLicenseRequestProcessedAsRequest:)
    func onLicenseRequestProcessedAsRequest(_ result: NSDictionary) -> Void {
        self.contentProtectionAPI.onLicenseRequestProcessedAsRequest(result: result)
    }
    
    @objc(onLicenseRequestProcessedAsLicense:)
    func onLicenseRequestProcessedAsLicense(_ result: NSDictionary) -> Void {
        self.contentProtectionAPI.onLicenseRequestProcessedAsLicense(result: result)
    }
    
    @objc(onLicenseResponseProcessed:)
    func onLicenseResponseProcessed(_ result: NSDictionary) -> Void {
        self.contentProtectionAPI.onLicenseResponseProcessed(result: result)
    }
    
    @objc(onExtractFairplayContentIdProcessed:)
    func onExtractFairplayContentIdProcessed(_ result: NSDictionary) -> Void {
        self.contentProtectionAPI.onExtractFairplayContentIdProcessed(result: result)
    }
}
