# Expo

## Overview

[Expo](https://expo.dev/) is an open-source platform built around React Native that simplifies
the development of cross-platform mobile applications.
It provides a powerful set of tools, libraries, and services that handle much of the native
configuration and boilerplate typically required when working directly with React Native.

React Native THEOplayer integrates with Expo through a **dedicated plugin** that allows you
to configure the app **without modifying native files**.
Currently, the plugin is focused on enabling configuration of THEOplayer extensions.

### THEOplayer Extensions

The `react-native-theoplayer` package includes an Expo plugin that enables THEOplayer extensions
through configuration in your app’s `app.json`.

You can configure it globally for all platforms:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-theoplayer",
        {
          "extensions": ["cast", "dai", "ima", "millicast", "theoads"]
        }
      ]
    ]
  }
}
```

Or specify extensions per platform:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-theoplayer",
        {
          "ios": {
            "extensions": ["cast", "ima", "millicast", "sideloaded-texttracks","theoads"]
          },
          "android": {
            "extensions": ["cast", "dai", "ima", "millicast", "theoads"]
          }
        }
      ]
    ]
  }
}
```
