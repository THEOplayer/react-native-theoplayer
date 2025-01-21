//
//  THEORCTEventBroadcastModule.m
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(THEORCTEventBroadcastModule, NSObject)

RCT_EXTERN_METHOD(broadcastEvent:(nonnull NSNumber *)node
                  event:(NSDictionary)event);

@end
