#import "THEORCTTestModule.h"
#import <React/RCTUIManager.h>

@implementation THEORCTTestModule_objc

RCT_EXPORT_MODULE(THEORCTTestModule)
@synthesize bridge = _bridge;

- (instancetype)init {
    if (self = [super init]) {

    }
    return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeTestModuleSpecJSI>(params);
}
- (void)setMyInt32:(NSInteger)value { 
    NSLog(@"My Int32 (ObjC): %ld", value);
}

@end
