import type { EventListener } from 'theoplayer';
import type { PlayerFacadeAds, PlayerFacadeAdsEventMap as AdsEventMap, PlayerFacadeEvent, PlayerFacadeIntegration } from './PlayerFacadeTypes';

type AdEventType = keyof AdsEventMap;
type AdEvent = AdsEventMap[AdEventType];
type Listener = EventListener<AdEvent>;
type Subscription = { listeners: Set<Listener>; remove: () => void };

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
  private readonly subscriptions = new Map<AdEventType, Subscription>();
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
      let subscription = this.subscriptions.get(type);
      if (!subscription) {
        subscription = { listeners: new Set(), remove: () => undefined };
        subscription.remove = this.bindListener(type, subscription);
        this.subscriptions.set(type, subscription);
      }
      subscription.listeners.add(listener as Listener);
    }
  };

  readonly removeEventListener = <TType extends AdEventType>(types: TType | readonly TType[], listener: EventListener<AdsEventMap[TType]>): void => {
    for (const type of typeof types === 'string' ? [types] : types) {
      const subscription = this.subscriptions.get(type);
      if (!subscription) continue;
      subscription.listeners.delete(listener as Listener);
      if (!subscription.listeners.size) {
        subscription.remove();
        this.subscriptions.delete(type);
      }
    }
  };

  private bindListener(type: AdEventType, subscription: Subscription): () => void {
    const integration = this.getIntegration();
    const ads = integration?.ads ?? this.nativeAds;
    let attached = true;
    const isCurrentSource = () => attached && this.getIntegration() === integration && this.subscriptions.get(type) === subscription;
    const forward: Listener = (event) => {
      // A detached source may still deliver an event queued before the integration changed.
      if (!isCurrentSource() || this.closed) return;
      if (ads === this.nativeAds && integration?.shouldConsumeAdEvent?.(event) === true) return;
      this.dispatch(event, isCurrentSource);
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
    for (const [type, subscription] of this.subscriptions) {
      subscription.remove();
      subscription.remove = this.bindListener(type, subscription);
    }
  }

  dispatch(event: AdEvent, isCurrentRegistration: () => boolean): void {
    const listeners = this.subscriptions.get(event.type)?.listeners;
    for (const listener of [...(listeners ?? [])]) {
      // Listeners can remove each other or unregister the integration during delivery.
      if (!this.closed && isCurrentRegistration() && listeners?.has(listener)) listener(event);
    }
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    const subscriptions = [...this.subscriptions.values()];
    this.subscriptions.clear();
    for (const subscription of subscriptions) subscription.remove();
  }
}
