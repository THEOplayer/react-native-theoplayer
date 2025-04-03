# Migrating to THEOplayer React Native SDK 9.x

This article will guide you through updating from THEOplayer React Native SDK version 9 (from version 8),
and the changes needed in your code.

## Update React Native THEOplayer

Run the following command to install THEOplayer React Native SDK version 9:

```bash
npm install react-native-theoplayer@9
```

## Removed `chromeless` config parameter

To extend React Native THEOplayer with a user interface, it's recommended to either use the
[`@theoplayer/react-native-ui`](https://github.com/THEOplayer/react-native-theoplayer-ui)
package or create a custom UI in React Native. Support for the native `chromefull` UI has been removed.

## Removed `enableTHEOlive` config parameter

THEOlive is now always enabled, eliminating the need for an additional configuration parameter.

## Media3 as default playback pipeline on Android

On Android platforms, the Media3 playback pipeline is now enabled by default.
This new pipeline is built on top of [Jetpack Media3](https://developer.android.com/media/media3),
which aims to provide more stable playback on a wider range of devices.
See [our Media3 guide](../../../how-to-guides/android/media3/getting-started.mdx) for more information.

We highly recommend using the Media3 playback pipeline. However, if you need some more time to make the switch,
you can still revert to the legacy playback pipeline from version 8.x by setting
`playbackPipeline` to `PlaybackPipeline.LEGACY` in the [`SourceDescription`](../src/api/source/SourceDescription.ts)
passed to the player.

### Warning

The legacy playback pipeline is scheduled to be removed in THEOplayer version 10.

If you run into an issue that prevents you from switching to Media3, please contact our Service Desk.

## Media3 as default backend for caching

Newly created caching tasks now use the Media3 backend by default.
Sources cached with this backend can only be played using the Media3 playback pipeline.

If you need some more time to make the switch, you can still revert to the legacy cache storage from version 8.x
by setting `CachingParameters.storageType` to `CacheStorageType.LEGACY` during creation of a caching task.

### Warning

The legacy cache storage is scheduled to be removed in THEOplayer version 10.

If you run into an issue that prevents you from switching to Media3, please contact our Service Desk.

## Removed Media3 integration package on Android

The Media3 playback pipeline now ships with the THEOplayer Android SDK, and is no longer published as an extension.
This means the build flag `THEOplayer_extensionMedia3` can be dropped from your app's `gradle.properties`.

