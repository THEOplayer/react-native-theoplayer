import type { ChromelessPlayer, EventListener, PlayerEventMap } from 'theoplayer';
import { PlayerFacadeAdsEvents } from './PlayerFacadeAdsEvents';
import type { IntegrationRegistration, PlayerFacade as PlayerFacadeAPI, PlayerFacadeEvent, PlayerFacadeIntegration } from './PlayerFacadeTypes';

type Registration = IntegrationRegistration & { integration?: PlayerFacadeIntegration };
type PlayerEvent = PlayerEventMap[keyof PlayerEventMap];
type PlayerEventSubscription = {
  listeners: Set<EventListener<PlayerEvent>>;
  interceptors: Set<(event: PlayerEvent) => boolean>;
  forward: EventListener<PlayerEvent>;
};

// Resolve the current backing object on every access while preserving its method receiver and identity.
function delegate<T extends object, TOverrides extends object>(backing: () => T, overrides: TOverrides): T & TOverrides {
  const methods = new Map<PropertyKey, { original: unknown; receiver: object; bound: unknown }>();
  return new Proxy(Object.create(Object.getPrototypeOf(backing())) as T & TOverrides, {
    get: (_target, property) => {
      const receiver = Object.prototype.hasOwnProperty.call(overrides, property) ? overrides : backing();
      const value: unknown = Reflect.get(receiver, property, receiver);
      if (typeof value !== 'function' || property === 'constructor') return value;
      const cached = methods.get(property);
      if (cached?.original !== value || cached.receiver !== receiver)
        methods.set(property, { original: value, receiver, bound: value.bind(receiver) });
      return methods.get(property)!.bound;
    },
    set: (_target, property, value) => {
      const receiver = Reflect.getOwnPropertyDescriptor(overrides, property)?.set ? overrides : backing();
      return Reflect.set(receiver, property, value, receiver);
    },
    has: (_target, property) => property in overrides || property in backing(),
    ownKeys: () => [...new Set([...Reflect.ownKeys(backing()), ...Reflect.ownKeys(overrides)])],
    getOwnPropertyDescriptor: (_target, property) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(overrides, property) ?? Reflect.getOwnPropertyDescriptor(backing(), property);
      return descriptor && { ...descriptor, configurable: true };
    },
    preventExtensions: () => false,
  });
}

/**
 * Stable player surface with generic integration hooks; no playback or ad-lifecycle policy lives here.
 *
 * @internal
 */
export class PlayerFacade {
  readonly player: PlayerFacadeAPI;
  private readonly nativeAds: PlayerFacadeAPI['ads'] | undefined;
  private readonly adsEvents: PlayerFacadeAdsEvents;
  private readonly playerSubscriptions = new Map<keyof PlayerEventMap, PlayerEventSubscription>();
  private readonly playerInterceptors = new Set<(event: PlayerEvent) => boolean>();
  private registration?: Registration;
  private closed = false;

  constructor(readonly contentPlayer: ChromelessPlayer) {
    this.nativeAds = contentPlayer.ads as PlayerFacadeAPI['ads'];
    this.adsEvents = new PlayerFacadeAdsEvents(this.nativeAds, () => this.registration?.integration);
    const readAdState = () => this.registration?.integration?.ads ?? this.registration?.integration?.getAdState?.();
    const readPlaying = () => readAdState()?.playing ?? this.nativeAds?.playing ?? false;
    const readAds = () => readAdState()?.currentAds ?? this.nativeAds?.currentAds ?? [];
    const readBreak = () => {
      const state = readAdState();
      return state ? state.currentAdBreak : this.nativeAds?.currentAdBreak;
    };
    const readTime = () => {
      const value = this.registration?.integration?.getCurrentTime?.();
      return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : contentPlayer.currentTime;
    };
    const writeTime = (value: number) => {
      if (this.registration?.integration?.setCurrentTime?.(value) !== true) contentPlayer.currentTime = value;
    };
    const readPaused = () => this.registration?.integration?.isPaused?.() ?? contentPlayer.paused;
    const readSeeking = () => this.registration?.integration?.isSeeking?.() ?? contentPlayer.seeking;
    const readDuration = () => this.registration?.integration?.getDuration?.() ?? contentPlayer.duration;
    const emptyAds = {} as PlayerFacadeAPI['ads'];
    // Consumers may retain player.ads before registration; only its backing source should change.
    const ads = delegate(() => this.registration?.integration?.ads ?? this.nativeAds ?? emptyAds, {
      get playing() {
        return readPlaying();
      },
      get currentAds() {
        return readAds();
      },
      get currentAdBreak() {
        return readBreak();
      },
      addEventListener: this.adsEvents.addEventListener,
      removeEventListener: this.adsEvents.removeEventListener,
    });
    const readMuted = () => this.registration?.integration?.getMuted?.() ?? contentPlayer.muted;
    const writeMuted = (value: boolean) => {
      if (this.registration?.integration?.setMuted?.(value) !== true) contentPlayer.muted = value;
    };
    const readVolume = () => this.registration?.integration?.getVolume?.() ?? contentPlayer.volume;
    const writeVolume = (value: number) => {
      if (this.registration?.integration?.setVolume?.(value) !== true) contentPlayer.volume = value;
    };
    this.player = delegate(() => contentPlayer, {
      get muted() {
        return readMuted();
      },
      set muted(value: boolean) {
        writeMuted(value);
      },
      get volume() {
        return readVolume();
      },
      set volume(value: number) {
        writeVolume(value);
      },
      ads,
      contentPlayer,
      registerIntegration: this.registerIntegration.bind(this),
      addEventListener: this.addPlayerEventListener,
      removeEventListener: this.removePlayerEventListener,
      get currentTime() {
        return readTime();
      },
      set currentTime(value: number) {
        writeTime(value);
      },
      get paused() {
        return readPaused();
      },
      get seeking() {
        return readSeeking();
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
    this.getPlayerSubscription('destroy');
  }

  registerIntegration(integration: PlayerFacadeIntegration): IntegrationRegistration {
    if (this.closed) throw new Error('The player facade has been closed.');
    if (this.registration) throw new Error('Unregister the previous integration first.');
    if (!integration || typeof integration !== 'object') throw new Error('An integration must be an object implementing Integration.');
    for (const method of [
      'getCurrentTime',
      'setCurrentTime',
      'play',
      'pause',
      'isPaused',
      'isSeeking',
      'getDuration',
      'getMuted',
      'setMuted',
      'getVolume',
      'setVolume',
      'getAdState',
      'shouldConsumeAdEvent',
    ] as const) {
      if (integration[method] !== undefined && typeof integration[method] !== 'function') {
        throw new Error(`Integration.${method} must be a function.`);
      }
    }
    const registration: Registration = {
      integration,
      dispatchPlayerEvent: (event) => this.dispatchEvent(registration, event),
      dispatchEvent: (event) => this.dispatchEvent(registration, event),
      interceptPlayerEvent: (type, callback) => {
        if (this.closed || this.registration !== registration) return () => undefined;
        const subscription = this.getPlayerSubscription(type);
        const interceptor = callback as (event: PlayerEvent) => boolean;
        subscription.interceptors.add(interceptor);
        return () => {
          subscription.interceptors.delete(interceptor);
          this.releasePlayerSubscription(type, subscription);
        };
      },
      interceptPlayerEvents: (interceptor) => {
        if (this.closed || this.registration !== registration) return () => undefined;
        this.playerInterceptors.add(interceptor);
        return () => {
          this.playerInterceptors.delete(interceptor);
        };
      },
      close: () => {
        registration.integration = undefined;
        if (this.registration !== registration) return;
        this.registration = undefined;
        // Interceptors have explicit disposers so queued backing events can drain after unregistering.
        if (!this.closed) this.adsEvents.rebind();
      },
    };
    this.registration = registration;
    try {
      this.adsEvents.rebind();
    } catch (error) {
      registration.close();
      throw error;
    }
    return registration;
  }

  private getPlayerSubscription(type: keyof PlayerEventMap): PlayerEventSubscription {
    const existing = this.playerSubscriptions.get(type);
    if (existing) return existing;
    // One backing listener per type lets interceptors decide once for all facade consumers.
    const subscription: PlayerEventSubscription = {
      listeners: new Set(),
      interceptors: new Set(),
      forward: (event) => {
        try {
          for (const interceptor of [...subscription.interceptors]) {
            if (subscription.interceptors.has(interceptor) && interceptor(event)) return;
          }
          for (const interceptor of [...this.playerInterceptors]) {
            if (this.playerInterceptors.has(interceptor) && interceptor(event)) return;
          }
          for (const listener of [...subscription.listeners]) {
            if (subscription.listeners.has(listener)) listener(event);
          }
        } finally {
          if (type === 'destroy') this.close();
        }
      },
    };
    this.playerSubscriptions.set(type, subscription);
    this.contentPlayer.addEventListener(type, subscription.forward);
    return subscription;
  }

  private releasePlayerSubscription(type: keyof PlayerEventMap, subscription: PlayerEventSubscription): void {
    if (type === 'destroy' || subscription.listeners.size || subscription.interceptors.size || this.playerSubscriptions.get(type) !== subscription)
      return;
    this.contentPlayer.removeEventListener(type, subscription.forward);
    this.playerSubscriptions.delete(type);
  }

  private readonly addPlayerEventListener: ChromelessPlayer['addEventListener'] = (types, listener) => {
    if (this.closed) throw new Error('The player facade has been closed.');
    for (const type of typeof types === 'string' ? [types] : types) {
      this.getPlayerSubscription(type).listeners.add(listener as EventListener<PlayerEvent>);
    }
  };

  private readonly removePlayerEventListener: ChromelessPlayer['removeEventListener'] = (types, listener) => {
    for (const type of typeof types === 'string' ? [types] : types) {
      const subscription = this.playerSubscriptions.get(type);
      if (!subscription) continue;
      subscription.listeners.delete(listener as EventListener<PlayerEvent>);
      this.releasePlayerSubscription(type, subscription);
    }
  };

  private dispatchEvent(registration: Registration, event: PlayerFacadeEvent): void {
    const isCurrentRegistration = () => !this.closed && this.registration === registration;
    if (!isCurrentRegistration()) return;
    if (!event || typeof event.type !== 'string') throw new Error('A THEOplayer event with a type is required.');
    if (PlayerFacadeAdsEvents.isAdEvent(event)) {
      this.adsEvents.dispatch(event, isCurrentRegistration);
      return;
    }
    // Integration events already represent public playback state; backing-player filters must not consume them.
    const listeners = this.playerSubscriptions.get(event.type)?.listeners;
    for (const listener of [...(listeners ?? [])]) {
      if (isCurrentRegistration() && listeners?.has(listener)) listener(event);
    }
  }

  close = (): void => {
    if (this.closed) return;
    this.closed = true;
    this.registration?.close();
    this.playerInterceptors.clear();
    for (const [type, subscription] of this.playerSubscriptions) {
      subscription.listeners.clear();
      subscription.interceptors.clear();
      this.contentPlayer.removeEventListener(type, subscription.forward);
    }
    this.playerSubscriptions.clear();
    this.adsEvents.close();
  };
}
