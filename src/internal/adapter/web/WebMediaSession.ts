/* eslint-disable @typescript-eslint/no-empty-function */
import type { ChromelessPlayer } from 'theoplayer';
import type { THEOplayerWebAdapter } from '../THEOplayerWebAdapter';
import { MediaControlConfiguration } from 'react-native-theoplayer';

const DEFAULT_SKIP_FORWARD_INTERVAL = 5;
const DEFAULT_SKIP_BACKWARD_INTERVAL = 5;

export const defaultMediaControlConfiguration: MediaControlConfiguration = {
  mediaSessionEnabled: true,
  skipForwardInterval: DEFAULT_SKIP_FORWARD_INTERVAL,
  skipBackwardInterval: DEFAULT_SKIP_BACKWARD_INTERVAL,
};

const NoOp = () => {};

// This prevents unnecessary errors when Media Session API is not available.
const mediaSession = (function () {
  const mediaSession = navigator.mediaSession || {};
  mediaSession.setActionHandler = navigator.mediaSession?.setActionHandler || function () {};
  mediaSession.setPositionState = navigator.mediaSession?.setPositionState || function () {};
  window.MediaMetadata = window.MediaMetadata || function () {};
  return mediaSession;
})();

/**
 * The MediaSession interface of the Media Session API allows a web page to provide custom behaviors for standard media playback interactions, and
 * to report metadata that can be sent by the user agent to the device or operating system for presentation in standardized user interface elements.
 *
 * @link https://w3c.github.io/mediasession
 */
export class WebMediaSession {
  private readonly _config: MediaControlConfiguration;
  private readonly _player: ChromelessPlayer;
  private readonly _webAdapter: THEOplayerWebAdapter;

  constructor(adapter: THEOplayerWebAdapter, player: ChromelessPlayer, config: MediaControlConfiguration = defaultMediaControlConfiguration) {
    this._player = player;
    this._webAdapter = adapter;
    this._config = config;
    this._player.addEventListener('sourcechange', this.onSourceChange);
  }

  updateMediaSession() {
    // update trickplay capabilities
    if (this.isTrickPlayEnabled()) {
      mediaSession.setActionHandler('seekbackward', (event) => {
        const skipTime = event.seekOffset || this._config.skipBackwardInterval || DEFAULT_SKIP_BACKWARD_INTERVAL;
        this._player.currentTime = Math.max(this._player.currentTime - skipTime, 0);
        this.updatePositionState();
      });
      mediaSession.setActionHandler('seekforward', (event) => {
        const skipTime = event.seekOffset || this._config.skipForwardInterval || DEFAULT_SKIP_FORWARD_INTERVAL;
        this._player.currentTime = Math.min(this._player.currentTime + skipTime, this._player.duration);
        this.updatePositionState();
      });
      mediaSession.setActionHandler('seekto', (event) => {
        const seekTime = event.seekTime;
        if (seekTime !== undefined) {
          this._player.currentTime = seekTime;
        }
        this.updatePositionState();
      });
    } else {
      mediaSession.setActionHandler('seekbackward', NoOp);
      mediaSession.setActionHandler('seekforward', NoOp);
      mediaSession.setActionHandler('seekto', NoOp);
    }

    // update play/pause capabilities
    if (this.isPlayPauseEnabled()) {
      mediaSession.setActionHandler('play', () => {
        this._player?.play();
      });
      mediaSession?.setActionHandler('pause', () => {
        this._player?.pause();
      });
    } else {
      mediaSession.setActionHandler('play', NoOp);
      mediaSession.setActionHandler('pause', NoOp);
    }

    // update playbackState
    mediaSession.playbackState = this._player.paused ? 'paused' : 'playing';

    // update position
    this.updatePositionState();
  }

  destroy() {
    this._player.removeEventListener(['play', 'playing'], this.onFirstPlaying);
    this._player.removeEventListener(['play', 'pause', 'loadedmetadata', 'durationchange', 'ratechange'], this.update);
    this._player.ads?.removeEventListener(['adbreakbegin', 'adbreakend'], this.update);
    mediaSession.setActionHandler('play', NoOp);
    mediaSession.setActionHandler('pause', NoOp);
    mediaSession.setActionHandler('seekbackward', NoOp);
    mediaSession.setActionHandler('seekforward', NoOp);
    mediaSession.setActionHandler('seekto', NoOp);
  }

  private update = () => {
    this.updateMediaSession();
  };

  private onFirstPlaying = () => {
    this._player.removeEventListener(['play', 'playing'], this.onFirstPlaying);
    this.updateMetadata();
    this._player.addEventListener(['play', 'pause', 'loadedmetadata', 'durationchange', 'ratechange'], this.update);
    this._player.ads?.addEventListener(['adbreakbegin', 'adbreakend'], this.update);
  };

  private onSourceChange = () => {
    this._player.removeEventListener(['play', 'playing'], this.onFirstPlaying);
    this._player.removeEventListener(['play', 'pause', 'loadedmetadata', 'durationchange', 'ratechange'], this.update);
    this._player.ads?.removeEventListener(['adbreakbegin', 'adbreakend'], this.update);
    mediaSession.metadata = null;
    mediaSession.playbackState = 'none';
    this._player.addEventListener(['play', 'playing'], this.onFirstPlaying);
  };

  private updateMetadata = () => {
    const source = this._player.source;
    const metadata = source?.metadata;
    const artwork = [metadata?.displayIconUri, source?.poster, ...(metadata?.images ? metadata.images : [])]
      .filter((image) => image !== undefined)
      .map((image) => {
        if (typeof image === 'string') {
          return { src: image };
        }
        return image;
      });
    mediaSession.metadata = new MediaMetadata({
      title: metadata?.title,
      artist: metadata?.artist || metadata?.subtitle,
      album: metadata?.album,
      artwork,
    });
  };

  private updatePositionState = () => {
    const { duration, playbackRate, currentTime } = this._player;
    const isLive = !isFinite(duration);
    if (!isLive) {
      mediaSession.setPositionState({
        // The duration is used to specify the duration in seconds.
        // It should always be positive and positive infinity can be used to indicate media without a defined end such as live playback.
        // NOTE: passing Infinite causes an exception to be thrown.
        duration: isNaN(duration) || duration < 0 ? 0 : duration,

        // The playbackRate is used to specify the playback rate.
        // It can be positive to represent forward playback or negative to represent backwards playback. It should not be zero.
        playbackRate,

        // The position is used to specify the last reported playback position in seconds. It should always be positive.
        position: currentTime,
      });
    }
  };

  private isLive(): boolean {
    return !isFinite(this._player.duration);
  }

  private isInAd(): boolean {
    return this._player.ads?.playing === true;
  }

  private isInBackground(): boolean {
    return document.visibilityState !== 'visible';
  }

  // By default, only show trick-play buttons if:
  // - backgroundAudio is enabled, or the player is in foreground;
  // - and, the current asset is neither a live stream, nor an ad.
  private isTrickPlayEnabled(): boolean {
    return (this.isBackgroundAudioEnabled() || !this.isInBackground()) && !this.isLive() && !this.isInAd();
  }

  // By default, only show a play/pause button if:
  // - backgroundAudio is enabled, or the player is in foreground;
  // - and, the current asset is not an ad.
  private isPlayPauseEnabled(): boolean {
    return (this.isBackgroundAudioEnabled() || !this.isInBackground()) && !this.isInAd();
  }

  private isBackgroundAudioEnabled(): boolean {
    return this._webAdapter.backgroundAudioConfiguration.enabled === true;
  }
}
