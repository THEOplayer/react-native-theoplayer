import type { EventListener } from 'theoplayer';
import type { PlayerFacadeAds, PlayerFacadeAdsEventMap as AdsEventMap, PlayerFacadeEvent, PlayerFacadeIntegration } from './PlayerFacadeTypes';

type AdEventType = keyof AdsEventMap;
type AdEvent = AdsEventMap[AdEventType];
type Listener = EventListener<AdEvent>;

// This table selects the Ads event surface; it does not restrict player event dispatch.
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
  adclicked: true,
  adfirstquartile: true,
  admidpoint: true,
  adthirdquartile: true,
  adbuffering: true,
  admetadata: true,
  adsmanagerloaded: true,
};

/** Keeps public Ads listeners stable while their backing event source changes. */
export class PlayerFacadeAdsEvents {
  private readonly subscriptions = new Map<AdEventType, Map<Listener, () => void>>();
  private closed = false;

  constructor(
    private readonly nativeAds: PlayerFacadeAds | undefined,
    private readonly getIntegration: () => PlayerFacadeIntegration | undefined,
  ) {}

  static isAdEvent(event: PlayerFacadeEvent): event is AdEvent {
    return Object.prototype.hasOwnProperty.call(AD_EVENTS, event.type);
  }

  readonly addEventListener = <TType extends AdEventType>(types: TType | readonly TType[], listener: EventListener<AdsEventMap[TType]>): void => {
    if (this.closed) throw new Error('The player facade has been closed.');
    for (const type of typeof types === 'string' ? [types] : types) {
      let listeners = this.subscriptions.get(type);
      if (!listeners) this.subscriptions.set(type, (listeners = new Map()));
      if (listeners.has(listener as Listener)) continue;
      listeners.set(listener as Listener, this.bindListener(type, listener as Listener));
    }
  };

  readonly removeEventListener = <TType extends AdEventType>(types: TType | readonly TType[], listener: EventListener<AdsEventMap[TType]>): void => {
    for (const type of typeof types === 'string' ? [types] : types) {
      const listeners = this.subscriptions.get(type);
      listeners?.get(listener as Listener)?.();
      listeners?.delete(listener as Listener);
      if (listeners?.size === 0) this.subscriptions.delete(type);
    }
  };

  private bindListener(type: AdEventType, listener: Listener): () => void {
    const ads = this.getIntegration()?.ads ?? this.nativeAds;
    let attached = true;
    const forward: Listener = (event) => {
      // A detached source may still deliver an event queued before the integration changed.
      if (!attached || this.closed || !this.subscriptions.get(type)?.has(listener)) return;
      if (ads === this.nativeAds && this.getIntegration()?.shouldConsumeAdEvent?.(event) === true) return;
      listener(event);
    };
    try {
      ads?.addEventListener(type, forward);
    } catch (error) {
      attached = false;
      ads?.removeEventListener(type, forward);
      throw error;
    }
    return () => {
      attached = false;
      ads?.removeEventListener(type, forward);
    };
  }

  rebind(): void {
    for (const [type, listeners] of this.subscriptions) {
      for (const [listener, remove] of listeners) {
        remove();
        listeners.set(listener, this.bindListener(type, listener));
      }
    }
  }

  dispatch(event: AdEvent, isCurrentRegistration: () => boolean): void {
    const listeners = this.subscriptions.get(event.type);
    for (const listener of [...(listeners?.keys() ?? [])]) {
      // Listeners can remove each other or unregister the integration during delivery.
      if (!this.closed && isCurrentRegistration() && listeners?.has(listener)) listener(event);
    }
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    const removals = [...this.subscriptions.values()].flatMap((listeners) => [...listeners.values()]);
    this.subscriptions.clear();
    for (const remove of removals) remove();
  }
}
