# wondery/react-native-theoplayer

This repository is a fork of the react-native-theoplayer package, intended for use in testing and demoing THEOplayer-related issues.

The `develop` branch should always be identical to the `develop` branch of the upstream react-native-theoplayer repository.
 
The `current` branch should depend on the latest version of THEOplayer and have React Native's new architecture disabled, to match the Wondery app.

## Setup

1. Clone the `current` branch.
2. Copy the .env.sample file to .env.
3. Copy the `THEOPLAYER_KEY` from `wondery/wonderyplus`'s `.env.dev` into this repository's `.env`.