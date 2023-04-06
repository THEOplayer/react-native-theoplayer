## Features

Depending on the platform on which the application is deployed, a different set of features is available.

If a feature missing, additional help is needed, or you need to extend the package,
please reach out to us for support.

| Feature                                           | Android<br/>AndroidTV<br/>FireTV |       Web       |   iOS / tvOS    |
|---------------------------------------------------|:--------------------------------:|:---------------:|:---------------:|
| DASH (mp4)                                        |         as of v3.6.1 (*)         |        V        |                 |
| DASH (fmp4)                                       |                V                 |        V        |                 |
| HLS (ts)                                          |         as of v3.6.1 (*)         |        V        |        V        |
| HLS (fmp4)                                        |                V                 |        V        |        V        |
| plain MP4                                         |         as of v3.6.1 (*)         |        V        |        V        |
| MP3                               		        |         as of v3.6.1 (*)         |        V        |        V        |
| DRM protection (Widevine)                         |                V                 |        V        |                 |
| DRM protection (PlayReady)                        |                V                 |        V        |                 |
| DRM protection (FairPlay)                         |               N/A                |     Safari      |        V        |
| Text tracks (TTML, WebVTT, CEA608 / 608 over 708) |                V                 |        V        |        V        |
| Text track selection                              |                V                 |        V        |        V        |
| Text track events                                 |                V                 |        V        |        V        |
| Media track selection                             |                V                 |        V        |        V        |
| Media track events                                |                V                 |        V        |     V (**)      |
| Google IMA CSAI                                   |                V                 |        V        |     V (***)     |
| Google DAI SSAI                                   |                V                 |        V        |    V (****)     |
| Chromeless                                        |                V                 |        V        |        V        |
| Chromefull (default SDK UI)                       |               N/A                |        V        |        V        |
| Fullscreen                                        |                V                 | with default UI | with default UI |
| Preview thumbnails                                |                V                 |        V        |  as of v3.6.0*  |
| Chromecast                                        |                V                 | with default UI |     V (***)     |
| Airplay                                           |               N/A                |     Safari      |        V        |
| Picture-in-Picture                                |                V                 |        V        |        V        |
| Background playback                               |                V                 |        V        |        V        |

(*) This refers to the underlying platform's THEOplayer SDK.

(**) Media quality change event is not available on iOS systems.

(***) When using a 4.x THEOplayer this requires a custom build for the iOS and tvOS framework from Portal, with the specific feature enabled.

(****) Not available with THEOplayer 5.x and requires a custom iOS framework build from Portal with the specific feature enabled, when using a 4.x THEOplayer.  This is not available for tvOS.
