#import "THEORCTContentProtectionModule.h"
#import <React/RCTUIManager.h>
#import "THEOplayerRCTView.h"

#import <react_native_theoplayer-Swift.h>

@implementation THEORCTContentProtectionModule_objc

RCT_EXPORT_MODULE(THEORCTContentProtectionModule)

- (instancetype)init {
    if (self = [super init]) {
        self.contentProtectionAPI = [[THEOplayerRCTContentProtectionAPI alloc] init];
    }
    return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeContentProtectionModuleSpecJSI>(params);
}

- (void)onBuildProcessed:(NSDictionary *)payload {
    [self.contentProtectionAPI onBuildProcessed:payload];
}

- (void)onCertificateRequestProcessedAsCertificate:(NSDictionary *)payload { 
    [self.contentProtectionAPI onCertificateRequestProcessedAsCertificate:payload];
}

- (void)onCertificateRequestProcessedAsRequest:(NSDictionary *)payload { 
    [self.contentProtectionAPI onCertificateRequestProcessedAsRequest:payload];
}

- (void)onCertificateResponseProcessed:(NSDictionary *)payload { 
    [self.contentProtectionAPI onCertificateResponseProcessed:payload];
}

- (void)onExtractFairplayContentIdProcessed:(NSDictionary *)payload { 
    [self.contentProtectionAPI onExtractFairplayContentIdProcessed:payload];
}

- (void)onLicenseRequestProcessedAsLicense:(NSDictionary *)payload { 
    [self.contentProtectionAPI onLicenseRequestProcessedAsLicense:payload];
}

- (void)onLicenseRequestProcessedAsRequest:(NSDictionary *)payload { 
    [self.contentProtectionAPI onLicenseRequestProcessedAsRequest:payload];
}

- (void)onLicenseResponseProcessed:(NSDictionary *)payload { 
    [self.contentProtectionAPI onLicenseResponseProcessed:payload];
}

- (void)registerContentProtectionIntegration:(NSString *)integrationId keySystemId:(NSString *)keySystemId { 
    [self.contentProtectionAPI registerContentProtectionIntegration:integrationId
                                                        keySystemId:keySystemId];
}


@end
