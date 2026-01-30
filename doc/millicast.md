# Getting started with Millicast on React Native

[Dolby Millicast](https://dolby.io/products/real-time-streaming/) delivers broadcast quality live streaming
at sub-second latency, enabling interactivity and fan engagement.
Using the THEOplayer Millicast integration, you can play your Millicast streams directly through THEOplayer.

## Usage

1. Follow [our Getting Started guide](./getting-started.md) to set up THEOplayer in your React Native app.
   The Millicast integration is available in the main [react-native-theoplayer](https://www.npmjs.com/package/react-native-theoplayer) package on npm.
2. Add a Millicast source to your player's source.

### Add a Millicast source

After setting up THEOplayer in your app, set its source to a `SourceDescription` containing a `MillicastSource`.
You'll need a Millicast account ID and stream name to identify your Millicast stream:

```tsx
const source: MillicastSource = {
  type: 'millicast',
  src: 'multiview',
  streamAccountId: 'k9Mwad',
  subscriberToken: '<token>', // This is only required for subscribing to secure streams and should be omitted otherwise.
  apiUrl: 'https://director.millicast.com/api/director/subscribe' // Required for support on Android
};
player.source = source;
```

### Add configuration

Optionally, you can provide additional configuration to the source, specific for working with Millicast streams. To
configure these settings, add a `connectOptions` property to the source object and specify the options.

In the example below, the configuration is used to disable any audio from the Millicast stream.
For an exhaustive list of these options, visit the
[API documentation](https://theoplayer.github.io/react-native-theoplayer/api/interfaces/MillicastConnectOptions.html).

```tsx
const source: MillicastSource = {
  type: 'millicast',
  /* ... */
  connectOptions: {
    disableAudio: true
    /* ... */
  }
};
```


## Note on minification on Android

When adding the Millicast integration into your android project, make sure to add the following keep rule in your `proguard-rules.pro` file:
```
-keep class kotlin.** { *; }
```

Otherwise, you will encounter a `ClassNotFoundException` when attempting to run the application.

## More information

- [API references](https://theoplayer.github.io/react-native-theoplayer/api/interfaces/MillicastSource.html)
- [Millicast documentation](https://docs.dolby.io/streaming-apis/docs/)
