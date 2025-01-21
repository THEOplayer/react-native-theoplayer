//
//  THEORCTContentProtectionModule.m
//

#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(THEORCTContentProtectionModule, NSObject)

RCT_EXTERN_METHOD(onBuildProcessed:(NSDictionary)result);

RCT_EXTERN_METHOD(onCertificateRequestProcessedAsRequest:(NSDictionary)result);

RCT_EXTERN_METHOD(onCertificateRequestProcessedAsCertificate:(NSDictionary)result);

RCT_EXTERN_METHOD(onCertificateResponseProcessed:(NSDictionary)result);

RCT_EXTERN_METHOD(onLicenseRequestProcessedAsRequest:(NSDictionary)result);

RCT_EXTERN_METHOD(onLicenseRequestProcessedAsLicense:(NSDictionary)result);

RCT_EXTERN_METHOD(onLicenseResponseProcessed:(NSDictionary)result);

RCT_EXTERN_METHOD(onExtractFairplayContentIdProcessed:(NSDictionary)result);

RCT_EXTERN_METHOD(registerContentProtectionIntegration:(nonnull NSString *)integrationId
                  keySystemId:(nonnull NSString *)keySystemId);

@end
