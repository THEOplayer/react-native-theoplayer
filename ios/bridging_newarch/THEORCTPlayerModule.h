#import "../newarch/rntheo/rntheo.h"

@class THEOplayerRCTPlayerAPI;

@interface THEORCTPlayerModule_objc : NSObject <NativePlayerModuleSpec>

@property (nonatomic, strong) THEOplayerRCTPlayerAPI *playerAPI;

- (instancetype)init;

@end
