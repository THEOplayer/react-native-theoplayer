#import "../newarch/rntheo/rntheo.h"

@class THEOplayerRCTAdsAPI;

@interface THEORCTAdsModule_objc : NSObject <NativeAdsModuleSpec>

@property (nonatomic, strong) THEOplayerRCTAdsAPI *adsAPI;

- (instancetype)init;

@end
