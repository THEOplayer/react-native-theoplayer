# Migrating to THEOplayer React Native SDK 10.x

This article will guide you through updating to THEOplayer React Native SDK version 10 (from version 9),
and the changes needed in your code.

## Update React Native THEOplayer

Run the following command to install THEOplayer React Native SDK version 10:

```bash
npm install react-native-theoplayer@10
```

## Breaking Changes on Android

### Media3 became the only available playback pipeline on Android

On Android platforms, the Media3 playback pipeline is now the only available pipeline. **The legacy
pipeline has been removed.**

### Cache storage type `legacy` removed

With the removal of the legacy pipeline,
the option to cache media content for this pipeline by setting `CachingTaskParameters.storageType`
was also removed.

### PlaybackSettingsAPI removed on Android

The `PlaybackSettingsAPI`, which allowed to control start-up and lip sync correction on the legacy
pipeline, has been removed.

### Updated `minSdk` to API 23 on Android

This aligns with [other Android Jetpack libraries requiring API 23 as of June 2025](https://developer.android.com/jetpack/androidx/versions#version-table).

