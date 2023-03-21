/* eslint-disable @typescript-eslint/no-empty-function */
import type { ChromelessPlayer } from 'theoplayer';

interface WebMediaSessionConfig {
  skipTime: number;
}

export const defaultWebMediaSessionConfig: WebMediaSessionConfig = {
  skipTime: 15,
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
  private readonly _config: WebMediaSessionConfig;
  private readonly _player: ChromelessPlayer;

  constructor(player: ChromelessPlayer, config: WebMediaSessionConfig = defaultWebMediaSessionConfig) {
    this._player = player;
    this._config = config;
    this._player.addEventListener('sourcechange', this.onSourceChange);
    this._player.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this._player.addEventListener('durationchange', this.onDurationChange);
    this._player.addEventListener('play', this.onPlay);
    this._player.addEventListener('pause', this.onPause);
    this._player.ads?.addEventListener('adbreakbegin', this.onAdbreakBegin);
    this._player.ads?.addEventListener('adbreakend', this.onAdbreakEnd);
    this.updateActionHandlers();
  }

  updateActionHandlers() {
    if (this.isTrickplayEnabled()) {
      mediaSession.setActionHandler('seekbackward', (event) => {
        const skipTime = event.seekOffset || this._config.skipTime;
        this._player.currentTime = Math.max(this._player.currentTime - skipTime, 0);
        this.updatePositionState();
      });
      mediaSession.setActionHandler('seekforward', (event) => {
        const skipTime = event.seekOffset || this._config.skipTime;
        this._player.currentTime = Math.min(this._player.currentTime + skipTime, this._player.duration);
        this.updatePositionState();
      });
    } else {
      mediaSession.setActionHandler('seekbackward', NoOp);
      mediaSession.setActionHandler('seekforward', NoOp);
    }

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
  }

  destroy() {
    this._player.removeEventListener('sourcechange', this.onSourceChange);
    this._player.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this._player.removeEventListener('durationchange', this.onDurationChange);
    this._player.removeEventListener('play', this.onPlay);
    this._player.removeEventListener('pause', this.onPause);
    this._player.ads?.removeEventListener('adbreakbegin', this.onAdbreakBegin);
    this._player.ads?.removeEventListener('adbreakend', this.onAdbreakEnd);
    mediaSession.setActionHandler('play', NoOp);
    mediaSession.setActionHandler('pause', NoOp);
    mediaSession.setActionHandler('seekbackward', NoOp);
    mediaSession.setActionHandler('seekforward', NoOp);
  }

  private onSourceChange = () => {
    const source = this._player.source;
    const metadata = source?.metadata;
    const artwork = [source?.poster, metadata?.displayIconUri, ...(metadata?.images ? metadata?.images : [])]
      .filter((image) => image !== undefined)
      .map((image) => {
        if (typeof image === 'string') {
          return { src: image };
        }
        return image;
      });
    mediaSession.metadata = new MediaMetadata({
      title: metadata?.title,
      artist: metadata?.artist,
      album: metadata?.album,
      artwork,
    });
    this.updatePositionState();
  };

  private onLoadedMetadata = () => {
    this.updateActionHandlers();
  };

  private onDurationChange = () => {
    this.updateActionHandlers();
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

  private onPlay = () => {
    mediaSession.playbackState = 'playing';
  };

  private onPause = () => {
    mediaSession.playbackState = 'paused';
  };

  private onAdbreakBegin = () => {
    this.updateActionHandlers();
  };

  private onAdbreakEnd = () => {
    this.updateActionHandlers();
  };

  private isLive(): boolean {
    return !isFinite(this._player?.duration);
  }

  private isPlayingAd(): boolean {
    return this._player?.ads?.playing == true;
  }

  private isTrickplayEnabled(): boolean {
    // By default, disable trick-play for live and ads.
    return !(this.isLive() || this.isPlayingAd());
  }

  private isPlayPauseEnabled(): boolean {
    // By default, disable play/pause during ads.
    return !this.isPlayingAd();
  }
}
