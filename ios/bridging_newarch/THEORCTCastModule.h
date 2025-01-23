#import "../newarch/rntheo/rntheo.h"

@class THEOplayerRCTCastAPI;

@interface THEORCTCastModule_objc : NSObject <NativeCastModuleSpec>

@property (nonatomic, strong) THEOplayerRCTCastAPI *castAPI;

- (instancetype)init;

@end
