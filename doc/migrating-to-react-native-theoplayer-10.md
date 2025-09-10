# Migrating to THEOplayer React Native SDK 10.x

This article will guide you through updating to THEOplayer React Native SDK version 10 (from version 9),
and the changes needed in your code.

## Update React Native THEOplayer

Run the following command to install THEOplayer React Native SDK version 10:

```bash
npm install react-native-theoplayer@10
```

## Media3 as the only available playback pipeline on Android

On Android platforms, the Media3 playback pipeline is now the only available pipeline. **The legacy
pipeline has been removed.**
