#ifndef THEORCTTypeUtils_h
#define THEORCTTypeUtils_h

#import "../newarch/rntheo/EventEmitters.h"
#import "../newarch/rntheo/Props.h"

NS_ASSUME_NONNULL_BEGIN

using namespace facebook::react;

@interface THEORCTTypeUtils: NSObject
+ (NSDictionary *) configFrom:(THEOplayerRCTViewConfigStruct) structData;
+ (THEOplayerRCTViewEventEmitter::OnNativePlayerReady) nativePlayerReadyDataFrom:(NSDictionary*) eventData;
@end

NS_ASSUME_NONNULL_END

#endif /* THEORCTTypeUtils_h */
