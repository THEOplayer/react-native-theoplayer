#import "../newarch/rntheo/rntheo.h"

@class THEOplayerRCTCacheAPI;

@interface THEORCTCacheModule_objc : NSObject <NativeCacheModuleSpec>

@property (nonatomic, strong) THEOplayerRCTCacheAPI *cacheAPI;

- (instancetype)init;

@end
