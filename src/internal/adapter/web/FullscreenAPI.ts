export interface FullscreenAPIMap {
  requestFullscreen_: 'requestFullscreen';
  exitFullscreen_: 'exitFullscreen';
  fullscreenElement_: 'fullscreenElement';
  fullscreenEnabled_: 'fullscreenEnabled';
  fullscreenchange_: 'fullscreenchange';
  fullscreenerror_: 'fullscreenerror';
}

export const fullscreenAPI: FullscreenAPIMap | undefined = (() => {
  if (!document) {
    return;
  }

  // browser API methods
  // map approach from Screenful.js - https://github.com/sindresorhus/screenfull.js
  const apiMap: string[][] = [
    // Spec: https://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
    ['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'],
    // WebKit
    [
      'webkitRequestFullscreen',
      'webkitExitFullscreen',
      'webkitFullscreenElement',
      'webkitFullscreenEnabled',
      'webkitfullscreenchange',
      'webkitfullscreenerror'
    ],
    // Old WebKit (Safari 5.1)
    [
      'webkitRequestFullScreen',
      'webkitCancelFullScreen',
      'webkitCurrentFullScreenElement',
      'webkitCancelFullScreen',
      'webkitfullscreenchange',
      'webkitfullscreenerror'
    ],
    // Mozilla
    ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'],
    // Microsoft
    ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']
  ];

  for (const browserMap of apiMap) {
    // check for exitFullscreen function
    if (browserMap[1] in document) {
      return {
        requestFullscreen_: browserMap[0],
        exitFullscreen_: browserMap[1],
        fullscreenElement_: browserMap[2],
        fullscreenEnabled_: browserMap[3],
        fullscreenchange_: browserMap[4],
        fullscreenerror_: browserMap[5]
      } as FullscreenAPIMap;
    }
  }

  return undefined;
})();
