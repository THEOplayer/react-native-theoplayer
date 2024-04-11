# Digital Rights Management (DRM)

## Overview

This section outlines how play-out of DRM protected content can be achieved with `react-native-theoplayer`.
A detailed explanation on how DRM (Digital Rights Management) works can be found in
[THEOplayer's knowledge base](https://www.theoplayer.com/docs/theoplayer/knowledge-base/content-protection/introduction/).

## Configuration

THEOplayer supports Fairplay, PlayReady and Widevine by default. Configuring a DRM
protected stream source with `react-native-theoplayer` is very similar to how it is
done for the Web SDK, by providing a `contentProtection` object in the source description.

```javascript
const source = {
  src: "<manifest>",
  type: "application/dash+xml",
  contentProtection: {
    widevine: {
      licenseAcquisitionURL: "https://widevine-dash.ezdrm.com/proxy?pX=..."
    },
    playready: {
      licenseAcquisitionURL: "https://playready.ezdrm.com/cency/preauth.aspx?pX=..."
    },
    fairplay: {
      certificateURL: 'https://fps.ezdrm.com/demo/video/eleisure.cer',
      licenseAcquisitionURL: 'https://fps.ezdrm.com/api/licenses/...'
    }
  }
}
const onReady = (player: THEOplayer) => {
  player.source = source;
}

<THEOplayerView onPlayerReady={onReady}/>
```

## Content Protection Integrations

### Pre-integrations

THEOplayer is [pre-integrated](https://www.theoplayer.com/docs/theoplayer/how-to-guides/drm/introduction/#pre-integrations)
with a number of commercial multi-DRM vendors, which means support for these vendors is already included
and enabled in the SDK.

In addition to these pre-integrations, the `react-native-theoplayer` SDK as well as all native THEOplayer
SDKs, come with the ability to create and register a custom DRM integration.

### Creating a custom protection integration

The implementation of a custom DRM integration for `react-native-theoplayer` is almost identical
to the implementation for the Web SDK, and is explained in detail on our
[THEOplayer DRM integrations](https://github.com/THEOplayer/samples-drm-integration)
repository.
This repository also contains a number of examples for well-known multi-DRM vendors.

### Registering a custom protection integration

Once the custom DRM integrations is created, it needs to be registered up-front as follows:

```
import { ContentProtectionRegistry } from 'react-native-theoplayer';
import { MyCustomFairplayContentProtectionIntegrationFactory } from './drm/MyCustomFairplayContentProtectionIntegrationFactory';

ContentProtectionRegistry.registerContentProtectionIntegration(
  'myCustomDRM',
  'fairplay',
  new MyCustomFairplayContentProtectionIntegrationFactory()
);
```

Finally, the `integrationId` used on registration (in this case `"myCustomDRM"`)
should be added to the sourceDescription so that THEOplayer knows which integration to
use for this source. Any additional `integrationParameters` needed by the custom integration
can be passed here as well.

```javascript
const source = {
  src: "<manifest>",
  type: "application/dash+xml",
  contentProtection: {
    fairplay: {
      certificateURL: 'https://example.domain.com/Certificate.cer',
      licenseAcquisitionURL: 'https://example.domain.com/FairPlay'
    },
    integration: "myCustomDRM",
    integrationParameters: {
      authToken: "<token>",
    }
  }
}
```
