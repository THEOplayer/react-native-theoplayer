#import "THEORCTContentProtectionModule.h"
#import <React/RCTUIManager.h>
#import "THEOplayerRCTView.h"

#import <react_native_theoplayer-Swift.h>

@implementation THEORCTContentProtectionModule_objc

RCT_EXPORT_MODULE(THEORCTContentProtectionModule)
@synthesize bridge = _bridge;

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

- (void)onBuildProcessed:(JS::NativeContentProtectionModule::SpecOnBuildProcessedPayload &)payload { 
    
}

- (void)onCertificateRequest:(NSDictionary *)payload { 
    
}

- (void)onCertificateRequestProcessedAsCertificate:(NSDictionary *)payload { 
    
}

- (void)onCertificateRequestProcessedAsRequest:(NSDictionary *)payload { 
    
}

- (void)onCertificateResponseProcessed:(NSDictionary *)payload { 
    
}

- (void)onExtractFairplayContentIdProcessed:(NSDictionary *)payload { 
    
}

- (void)onLicenseRequestProcessedAsLicense:(NSDictionary *)payload { 
    
}

- (void)onLicenseRequestProcessedAsRequest:(NSDictionary *)payload { 
    
}

- (void)onLicenseResponseProcessed:(NSDictionary *)payload { 
    
}

- (void)registerContentProtectionIntegration:(NSString *)integrationId keySystemId:(NSString *)keySystemId { 
    
}

@end
