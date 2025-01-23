#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"

@interface THEOplayerRCTViewManager : RCTViewManager
@end

@implementation THEOplayerRCTViewManager

RCT_EXPORT_MODULE(THEOplayerRCTView)

- (UIView *)view
{
    return [[UIView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(config, NSDictionary);

@end
