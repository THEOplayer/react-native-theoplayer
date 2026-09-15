import type { Ad, AdBreak, Ads, AdsEventMap, ChromelessPlayer, EventListener } from 'theoplayer';
import type { IntegrationRegistration, PlayerFacade as PlayerFacadeAPI } from '../../../api/player/PlayerFacade';
import type { Integration } from '../../../api/player/Integration';

type AdEventType = keyof AdsEventMap;
type AdEvent = AdsEventMap[AdEventType];
type Listener = EventListener<AdEvent>;
type Registration = IntegrationRegistration & { integration?: Integration };

const AD_EVENTS: Record<AdEventType, true> = {
  addadbreak: true,
  removeadbreak: true,
  adbreakbegin: true,
  adbreakend: true,
  adbreakchange: true,
  addad: true,
  updatead: true,
  updateadbreak: true,
  adloaded: true,
  adbegin: true,
  adend: true,
  adskip: true,
  aderror: true,
  adimpression: true,
  adfirstquartile: true,
  admidpoint: true,
  adthirdquartile: true,
  adbuffering: true,
  admetadata: true,
  adsmanagerloaded: true,
};

function delegate<T extends object, TOverrides extends object>(content: T, overrides: TOverrides): T & TOverrides {
  const methods = new Map<PropertyKey, { original: unknown; bound: unknown }>();
  return new Proxy(Object.create(Object.getPrototypeOf(content)) as T & TOverrides, {
    get: (_target, property) => {
      const receiver = Object.prototype.hasOwnProperty.call(overrides, property) ? overrides : content;
      const value: unknown = Reflect.get(receiver, property, receiver);
      if (typeof value !== 'function' || property === 'constructor') return value;
      if (methods.get(property)?.original !== value) methods.set(property, { original: value, bound: value.bind(receiver) });
      return methods.get(property)!.bound;
    },
    set: (_target, property, value) => {
      const receiver = Reflect.getOwnPropertyDescriptor(overrides, property)?.set ? overrides : content;
      return Reflect.set(receiver, property, value, receiver);
    },
    has: (_target, property) => property in overrides || property in content,
    ownKeys: () => [...new Set([...Reflect.ownKeys(content), ...Reflect.ownKeys(overrides)])],
    getOwnPropertyDescriptor: (_target, property) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(overrides, property) ?? Reflect.getOwnPropertyDescriptor(content, property);
      return descriptor && { ...descriptor, configurable: true };
    },
    preventExtensions: () => false,
  });
}

export class PlayerFacade {
  readonly player: PlayerFacadeAPI;
  private readonly nativeAds: Ads | undefined;
  private readonly subscriptions = new Map<AdEventType, Map<Listener, () => void>>();
  private registration?: Registration;
  private currentAd?: Ad;
  private currentBreak?: AdBreak;
  private revision = 0;
  private closed = false;

  constructor(readonly contentPlayer: ChromelessPlayer) {
    this.nativeAds = contentPlayer.ads;
    const readPlaying = () => (this.registration ? this.currentAd?.type === 'linear' : (this.nativeAds?.playing ?? false));
    const readAds = () => (this.registration ? (this.currentAd ? [this.currentAd] : []) : (this.nativeAds?.currentAds ?? []));
    const readBreak = () => (this.registration ? this.currentBreak : this.nativeAds?.currentAdBreak);
    const readTime = () => {
      const value = this.registration?.integration?.getCurrentTime?.();
      return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : contentPlayer.currentTime;
    };
    const writeTime = (value: number) => {
      if (this.registration?.integration?.setCurrentTime?.(value) !== true) contentPlayer.currentTime = value;
    };
    const readPaused = () => this.registration?.integration?.isPaused?.() ?? contentPlayer.paused;
    const readDuration = () => this.registration?.integration?.getDuration?.() ?? contentPlayer.duration;
    const ads = delegate(this.nativeAds ?? ({} as Ads), {
      get playing() {
        return readPlaying();
      },
      get currentAds() {
        return readAds();
      },
      get currentAdBreak() {
        return readBreak();
      },
      addEventListener: this.addEventListener,
      removeEventListener: this.removeEventListener,
    });
    this.player = delegate(contentPlayer, {
      ads,
      contentPlayer,
      registerIntegration: this.registerIntegration.bind(this),
      get currentTime() {
        return readTime();
      },
      set currentTime(value: number) {
        writeTime(value);
      },
      get paused() {
        return readPaused();
      },
      get duration() {
        return readDuration();
      },
      play: () => {
        if (this.registration?.integration?.play?.() !== true) contentPlayer.play();
      },
      pause: () => {
        if (this.registration?.integration?.pause?.() !== true) contentPlayer.pause();
      },
    });
    contentPlayer.addEventListener('destroy', this.close);
  }

  registerIntegration(integration: Integration): IntegrationRegistration {
    if (this.closed) throw new Error('The player facade has been closed.');
    if (this.registration) throw new Error('Unregister the previous integration first.');
    if (this.nativeAds?.playing || this.nativeAds?.currentAdBreak != null) throw new Error('Cannot register an integration during native ads.');
    if (!integration || typeof integration !== 'object') throw new Error('An integration must be an object implementing Integration.');
    for (const method of ['getCurrentTime', 'setCurrentTime', 'play', 'pause', 'isPaused', 'getDuration'] as const) {
      if (integration[method] !== undefined && typeof integration[method] !== 'function') {
        throw new Error(`Integration.${method} must be a function.`);
      }
    }
    const registration: Registration = {
      integration,
      dispatchEvent: (event) => this.dispatchEvent(registration, event),
      close: () => {
        registration.integration = undefined;
        if (this.registration !== registration) return;
        this.registration = undefined;
        this.currentAd = undefined;
        this.currentBreak = undefined;
        this.revision++;
      },
    };
    this.registration = registration;
    return registration;
  }

  private readonly addEventListener = <TType extends AdEventType>(
    types: TType | readonly TType[],
    listener: EventListener<AdsEventMap[TType]>,
  ): void => {
    if (this.closed) throw new Error('The player facade has been closed.');
    for (const type of typeof types === 'string' ? [types] : types) {
      let listeners = this.subscriptions.get(type);
      if (!listeners) this.subscriptions.set(type, (listeners = new Map()));
      if (listeners.has(listener as Listener)) continue;
      const nativeListener: EventListener<AdsEventMap[TType]> = (event) => {
        if (!this.closed && !this.registration) listener(event);
      };
      this.nativeAds?.addEventListener(type, nativeListener);
      listeners.set(listener as Listener, () => this.nativeAds?.removeEventListener(type, nativeListener));
    }
  };

  private readonly removeEventListener = <TType extends AdEventType>(
    types: TType | readonly TType[],
    listener: EventListener<AdsEventMap[TType]>,
  ): void => {
    for (const type of typeof types === 'string' ? [types] : types) {
      const listeners = this.subscriptions.get(type);
      listeners?.get(listener as Listener)?.();
      listeners?.delete(listener as Listener);
      if (listeners?.size === 0) this.subscriptions.delete(type);
    }
  };

  private dispatchEvent(registration: Registration, event: AdEvent): void {
    if (this.closed || this.registration !== registration) return;
    if (!event || !Object.prototype.hasOwnProperty.call(AD_EVENTS, event.type)) throw new Error('Only THEOplayer ad events can be dispatched.');
    if (event.type === 'adbreakbegin') {
      this.revision++;
      this.currentBreak = event.adBreak;
      this.currentAd = undefined;
    } else if (event.type === 'adbegin') {
      this.revision++;
      this.currentAd = event.ad;
      this.currentBreak = event.ad?.adBreak ?? this.currentBreak;
    }
    const revision = this.revision;
    try {
      for (const listener of [...(this.subscriptions.get(event.type)?.keys() ?? [])]) {
        if (!this.closed && this.registration === registration) listener(event);
      }
    } finally {
      if (this.registration === registration && this.revision === revision) {
        if ((event.type === 'adend' || event.type === 'adskip') && event.ad === this.currentAd) this.currentAd = undefined;
        if (event.type === 'adbreakend' && event.adBreak === this.currentBreak) {
          this.currentAd = undefined;
          this.currentBreak = undefined;
        }
      }
    }
  }

  close = (): void => {
    if (this.closed) return;
    this.closed = true;
    this.registration?.close();
    const removals = [...this.subscriptions.values()].flatMap((listeners) => [...listeners.values()]);
    this.subscriptions.clear();
    this.contentPlayer.removeEventListener('destroy', this.close);
    for (const remove of removals) remove();
  };
}
