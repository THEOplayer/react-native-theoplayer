#import "../newarch/rntheo/rntheo.h"

@class THEOplayerRCTEventBroadcastAPI;

@interface THEORCTEventBroadcastModule_objc : NSObject <NativeEventBroadcastModuleSpec>

@property (nonatomic, strong) THEOplayerRCTEventBroadcastAPI *eventBroadcastAPI;

- (instancetype)init;

@end
