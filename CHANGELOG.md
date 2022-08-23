# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.4.0]

### Fixed

- Fixed an issue on iOS where subtitles upon disappearing would sometimes leave a thin black line on the image.
- Fixed an issue on iOS where the player would not be destroyed after going to fullscreen.

### Added

- Improved determination of the stream source type on Android.

## [1.3.0]

### Fixed

- Fixed an issue where the app would crash due to the configured Flipper version.
- Fixed duplicate classes issue for Android when having dependencies on local libs folder.
- Fixed documentation feature matrix.
- Fixed duration scale in loadedmetadata event properties for Web.

## [1.2.0]

### Fixed

- Fixed a crash when removing text tracks event listeners on iOS.
- Fixed a number of broken links in the documentation.
- Removed unused files.

## [1.1.0]

### Added

- Initial release.
