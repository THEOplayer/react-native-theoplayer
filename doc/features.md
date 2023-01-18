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
| MP3                               		              |         as of v3.6.1 (*)         |        V        |        V        |
| DRM protection (Widevine)                         |                V                 |        V        |                 |
| DRM protection (PlayReady)                        |                V                 |        V        |                 |
| DRM protection (FairPlay)                         |                                  |     Safari      |        V        |
| Text tracks (TTML, WebVTT, CEA608 / 608 over 708) |                V                 |        V        |        V        |
| Text track selection                              |                V                 |        V        |        V        |
| Text track events                                 |                V                 |        V        |        V        |
| Media track selection                             |                V                 |        V        |        V        |
| Media track events                                |                V                 |        V        |      (**)       |
| Google IMA CSAI                                   |                V                 |        V        |      (***)      |
| Google DAI SSAI                                   |                V                 |        V        |      (****)     |
| Chromeless                                        |                V                 |        V        |        V        |
| Chromefull (default SDK UI)                       |                                  |        V        |        V        |
| Fullscreen                                        |                V                 | with default UI | with default UI |
| Preview thumbnails                                |                V                 |        V        |  as of v3.6.0*  |
| Chromecast                                        |               N/A                | with default UI |      (***)      |
| Airplay                                           |               N/A                |     Safari      | with default UI |

(*) This refers to the underlying platform's THEOplayer SDK.

(**) Media quality change event. Not available on iOS systems.

(***) Requires a custom-built iOS and tvOS framework from Portal with the specific feature enabled.

(***) Requires a custom-built iOS framework from Portal with the specific feature enabled. This is currently not available on tvOS