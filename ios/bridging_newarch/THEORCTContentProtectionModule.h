#import "../newarch/rntheo/rntheo.h"

@class THEOplayerRCTContentProtectionAPI;

@interface THEORCTContentProtectionModule_objc : NSObject <NativeContentProtectionModuleSpec>

@property (nonatomic, strong) THEOplayerRCTContentProtectionAPI *contentProtectionAPI;

- (instancetype)init;

@end
