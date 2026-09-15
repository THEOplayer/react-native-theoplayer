import type { Ad, ChromelessPlayer } from 'theoplayer';

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

function loadSource(file: string): object {
  const compiled = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  new Function('exports', 'require', compiled.outputText)(exports, (specifier: string) => {
    assert.ok(specifier.startsWith('.'), 'Facade runtime imports must remain local');
    return loadSource(path.resolve(path.dirname(file), `${specifier}.ts`));
  });
  return exports;
}

const { PlayerFacade } = loadSource(
  path.resolve('src/internal/adapter/web/PlayerFacade.ts'),
) as typeof import('../internal/adapter/web/PlayerFacade');

function setup() {
  const added: unknown[][] = [];
  const removed: unknown[][] = [];
  const nativeAds = {
    playing: false,
    currentAds: [],
    currentAdBreak: undefined,
    addEventListener: (...args: unknown[]) => {
      added.push(args);
    },
    removeEventListener: (...args: unknown[]) => {
      removed.push(args);
    },
  };
  const content = { ads: nativeAds, currentTime: 100, addEventListener: () => undefined, removeEventListener: () => undefined };
  const facade = new PlayerFacade(content as unknown as ChromelessPlayer);
  const state = { playing: false, currentAds: [] as Ad[], currentAdBreak: null };
  const registration = facade.player.registerIntegration({ getCurrentTime: () => 2, getAdState: () => state });
  const ad = { id: 'ad', type: 'linear' } as Ad;
  return { facade, registration, ad, added, removed, state };
}

function setupPauseEvents(deferred = false) {
  const listeners = new Map<string, Set<(event: { type: string; date: Date }) => void>>();
  const pending: Array<() => void> = [];
  const content = {
    paused: false,
    currentTime: 100,
    failPause: false,
    ignorePause: false,
    addEventListener(type: string, listener: (event: { type: string; date: Date }) => void) {
      const entries = listeners.get(type) ?? new Set();
      entries.add(listener);
      listeners.set(type, entries);
    },
    removeEventListener(type: string, listener: (event: { type: string; date: Date }) => void) {
      listeners.get(type)?.delete(listener);
    },
    pause() {
      if (this.failPause) throw new Error('pause failed');
      if (this.paused || this.ignorePause) return;
      this.paused = true;
      const emit = () => {
        const event = { type: 'pause', date: new Date() };
        for (const listener of [...(listeners.get('pause') ?? [])]) listener(event);
      };
      if (deferred) pending.push(emit);
      else emit();
    },
    play() {
      this.paused = false;
    },
  };
  const facade = new PlayerFacade(content as unknown as ChromelessPlayer);
  const registration = facade.player.registerIntegration({});
  const ownedPauses = new Set<object>();
  let closed = false;
  const detach = registration.interceptPlayerEvent('pause', () => {
    const pendingPause = ownedPauses.values().next();
    if (!pendingPause.done) ownedPauses.delete(pendingPause.value);
    if (closed && !ownedPauses.size) detach();
    return !pendingPause.done;
  });
  const integration = {
    pauseContent() {
      if (closed) return;
      const owned = {};
      if (!content.paused) ownedPauses.add(owned);
      try {
        content.pause();
      } catch (error) {
        ownedPauses.delete(owned);
        throw error;
      }
      if (!content.paused) ownedPauses.delete(owned);
    },
    close() {
      closed = true;
      if (!ownedPauses.size) detach();
      registration.close();
    },
  };
  return {
    content,
    facade,
    registration,
    integration,
    emit: (type: string) => {
      const event = { type, date: new Date() };
      for (const listener of [...(listeners.get(type) ?? [])]) listener(event);
    },
    flush: () => {
      while (pending.length) pending.shift()!();
    },
  };
}

test('integration decides whether a generic player event reaches all facade listeners', () => {
  const { content, facade, registration, emit } = setupPauseEvents();
  let consume = true;
  let decisions = 0;
  let raw = 0;
  let visible = 0;
  content.addEventListener('waiting', () => raw++);
  facade.player.addEventListener('waiting', () => visible++);
  facade.player.addEventListener(['waiting', 'playing'], () => visible++);
  const remove = registration.interceptPlayerEvent('waiting', () => {
    decisions++;
    return consume;
  });
  emit('waiting');
  assert.equal(raw, 1);
  assert.equal(visible, 0);
  assert.equal(decisions, 1);
  consume = false;
  emit('waiting');
  assert.equal(raw, 2);
  assert.equal(visible, 2);
  assert.equal(decisions, 2);
  remove();
  emit('waiting');
  assert.equal(visible, 4);
  assert.equal(decisions, 2);
  facade.close();
});

test('catch-all interception covers existing and future subscriptions without filtering integration events', () => {
  const { content, facade, registration, emit } = setupPauseEvents();
  const seen: string[] = [];
  const raw: string[] = [];
  const decisions: string[] = [];
  facade.player.addEventListener('seeking', (event) => seen.push(event.type));
  const remove = registration.interceptPlayerEvents((event) => {
    decisions.push(event.type);
    return event.type !== 'sourcechange' && event.type !== 'destroy';
  });
  facade.player.addEventListener(['seeked', 'durationchange', 'sourcechange', 'destroy'], (event) => seen.push(event.type));
  for (const type of ['seeking', 'seeked', 'durationchange']) {
    content.addEventListener(type, (event) => raw.push(event.type));
    emit(type);
  }
  assert.deepEqual(raw, ['seeking', 'seeked', 'durationchange']);
  assert.deepEqual(decisions, raw);
  assert.deepEqual(seen, []);
  registration.dispatchEvent({ type: 'seeked', date: new Date(), currentTime: 4 });
  assert.deepEqual(seen, ['seeked']);
  emit('sourcechange');
  assert.deepEqual(seen, ['seeked', 'sourcechange']);
  registration.close();
  emit('seeked');
  assert.deepEqual(seen, ['seeked', 'sourcechange']);
  remove();
  emit('seeked');
  assert.deepEqual(seen, ['seeked', 'sourcechange', 'seeked']);
  registration.interceptPlayerEvents(() => true);
  emit('destroy');
  assert.equal(seen.at(-1), 'destroy');
  assert.throws(() => facade.player.addEventListener('playing', () => undefined), /closed/);
});

test('specific interceptors settle state before catch-all policy and respect disposer removal', () => {
  const { facade, registration, emit } = setupPauseEvents();
  const seen: string[] = [];
  facade.player.addEventListener('seeked', () => seen.push('consumer'));
  let removeLater: () => void = () => undefined;
  registration.interceptPlayerEvent('seeked', () => {
    seen.push('specific');
    return false;
  });
  registration.interceptPlayerEvents(() => {
    seen.push('first');
    removeLater();
    return false;
  });
  removeLater = registration.interceptPlayerEvents(() => {
    seen.push('removed');
    return true;
  });
  emit('seeked');
  assert.deepEqual(seen, ['specific', 'first', 'consumer']);
  facade.close();
  emit('seeked');
  assert.deepEqual(seen, ['specific', 'first', 'consumer']);
});

test('catch-all consumption of destroy still closes the facade and releases interceptors', () => {
  const { facade, registration, emit } = setupPauseEvents();
  let events = 0;
  registration.interceptPlayerEvents(() => {
    events++;
    return true;
  });
  emit('destroy');
  emit('destroy');
  assert.equal(events, 1);
  assert.throws(() => facade.player.registerIntegration({}), /closed/);
});

test('seeking state delegates to the integration and falls back on null or unregistering', () => {
  const content = { seeking: true, addEventListener: () => undefined, removeEventListener: () => undefined };
  const facade = new PlayerFacade(content as unknown as ChromelessPlayer);
  let seeking: boolean | null = false;
  const registration = facade.player.registerIntegration({ isSeeking: () => seeking });
  assert.equal(facade.player.seeking, false);
  seeking = null;
  assert.equal(facade.player.seeking, true);
  seeking = false;
  registration.close();
  assert.equal(facade.player.seeking, true);
  facade.close();
});

test('native destruction reaches facade consumers before generic cleanup', () => {
  const { facade, emit } = setupPauseEvents();
  let destroyed = 0;
  facade.player.addEventListener('destroy', () => destroyed++);
  emit('destroy');
  assert.equal(destroyed, 1);
  assert.throws(() => facade.player.addEventListener('playing', () => undefined), /closed/);
});

test('interceptors observe events without consumers and detach on facade destruction', () => {
  const { facade, registration, emit } = setupPauseEvents();
  let decisions = 0;
  registration.interceptPlayerEvent('timeupdate', () => {
    decisions++;
    return false;
  });
  emit('timeupdate');
  assert.equal(decisions, 1);
  facade.close();
  emit('timeupdate');
  assert.equal(decisions, 1);
});

for (const deferred of [false, true]) {
  test(`SDK content pause is hidden from all facade listeners, not raw listeners (deferred=${deferred})`, () => {
    const { content, facade, integration, flush } = setupPauseEvents(deferred);
    const seen: string[] = [];
    content.addEventListener('pause', () => seen.push('raw'));
    facade.player.addEventListener('pause', () => seen.push('facade-1'));
    facade.player.addEventListener(['pause', 'playing'], () => seen.push('facade-2'));
    integration.pauseContent();
    flush();
    assert.equal(content.paused, true);
    assert.deepEqual(seen, ['raw']);
    content.play();
    facade.player.pause();
    flush();
    assert.deepEqual(seen.slice(1).sort(), ['facade-1', 'facade-2', 'raw']);
    facade.close();
  });
}

test('repeated SDK pauses while already paused do not swallow a later user pause', () => {
  const { content, facade, integration, flush } = setupPauseEvents(true);
  const seen: string[] = [];
  facade.player.addEventListener('pause', () => seen.push('pause'));
  integration.pauseContent();
  integration.pauseContent();
  content.play();
  content.pause();
  flush();
  assert.deepEqual(seen, ['pause']);
  facade.close();
});

test('queued SDK pause stays hidden after registration closes without swallowing a user pause', () => {
  const { content, facade, integration, flush } = setupPauseEvents(true);
  const seen: string[] = [];
  facade.player.addEventListener('pause', () => seen.push('pause'));
  integration.pauseContent();
  integration.close();
  content.play();
  integration.pauseContent();
  assert.equal(content.paused, false);
  content.pause();
  flush();
  assert.deepEqual(seen, ['pause']);
  facade.close();
});

test('failed and no-op SDK pause calls do not leave suppression armed', () => {
  const { content, facade, integration } = setupPauseEvents();
  const seen: string[] = [];
  facade.player.addEventListener('pause', () => seen.push('pause'));
  content.failPause = true;
  assert.throws(() => integration.pauseContent(), /pause failed/);
  content.failPause = false;
  content.ignorePause = true;
  integration.pauseContent();
  content.ignorePause = false;
  content.pause();
  assert.deepEqual(seen, ['pause']);
  facade.close();
});

test('pause listener removal and facade destruction detach consumers', () => {
  const { content, facade } = setupPauseEvents();
  const seen: string[] = [];
  const listener = () => seen.push('pause');
  facade.player.addEventListener(['pause', 'playing'], listener);
  facade.player.removeEventListener(['pause', 'playing'], listener);
  content.pause();
  assert.deepEqual(seen, []);
  content.play();
  facade.player.addEventListener('pause', listener);
  facade.close();
  content.pause();
  assert.deepEqual(seen, []);
});

test('facade queries integration state without deriving it from ad events', () => {
  const { facade, registration, state, ad } = setup();
  state.playing = true;
  assert.equal(facade.player.ads.playing, true);
  assert.deepEqual(facade.player.ads.currentAds, []);
  registration.dispatchEvent({ type: 'adbegin', date: new Date(), ad });
  assert.deepEqual(facade.player.ads.currentAds, []);
  state.currentAds = [ad];
  assert.deepEqual(facade.player.ads.currentAds, [ad]);
  registration.dispatchEvent({ type: 'adend', date: new Date(), ad });
  assert.deepEqual(facade.player.ads.currentAds, [ad]);
  facade.close();
});

test('stable ads API delegates methods and migrates existing listeners across registration', () => {
  const listeners = () => new Set<(event: unknown) => void>();
  const nativeListeners = listeners();
  const integrationListeners = listeners();
  const createAds = (subscriptions: ReturnType<typeof listeners>, playing: boolean) => ({
    playing,
    currentAds: [],
    currentAdBreak: null,
    scheduledAds: [],
    scheduledAdBreaks: [],
    skips: 0,
    skip() {
      this.skips++;
    },
    addEventListener(_type: string, listener: (event: unknown) => void) {
      subscriptions.add(listener);
    },
    removeEventListener(_type: string, listener: (event: unknown) => void) {
      subscriptions.delete(listener);
    },
  });
  const nativeAds = createAds(nativeListeners, false);
  const integratedAds = createAds(integrationListeners, true);
  const content = { ads: nativeAds, addEventListener: () => undefined, removeEventListener: () => undefined };
  const facade = new PlayerFacade(content as unknown as ChromelessPlayer);
  const ads = facade.player.ads;
  const seen: unknown[] = [];
  const listener = (event: unknown) => seen.push(event);
  ads.addEventListener('adbegin', listener);
  const queuedNative = [...nativeListeners][0];
  const registration = facade.player.registerIntegration({ ads: integratedAds as unknown as typeof ads });
  assert.equal(facade.player.ads, ads);
  assert.equal(ads.playing, true);
  assert.equal(ads.scheduledAds, integratedAds.scheduledAds);
  assert.equal(nativeListeners.size, 0);
  queuedNative({ type: 'adbegin' });
  assert.deepEqual(seen, []);
  ads.skip();
  assert.equal(integratedAds.skips, 1);
  assert.equal(nativeAds.skips, 0);
  const event = { type: 'adbegin' };
  for (const forward of integrationListeners) forward(event);
  assert.deepEqual(seen, [event]);
  registration.close();
  assert.equal(integrationListeners.size, 0);
  assert.equal(ads.playing, false);
  ads.skip();
  assert.equal(nativeAds.skips, 1);
  ads.removeEventListener('adbegin', listener);
  assert.equal(nativeListeners.size, 0);
  facade.close();
});

test('audio accessors use integration hooks and fall back after unregistering', () => {
  const content = { muted: false, volume: 0.8, addEventListener: () => undefined, removeEventListener: () => undefined };
  const facade = new PlayerFacade(content as unknown as ChromelessPlayer);
  const audio = { muted: true, volume: 0.3 };
  const registration = facade.player.registerIntegration({
    getMuted: () => audio.muted,
    setMuted: (value) => {
      audio.muted = value;
      return true;
    },
    getVolume: () => audio.volume,
    setVolume: (value) => {
      audio.volume = value;
      return true;
    },
  });
  assert.equal(facade.player.muted, true);
  assert.equal(facade.player.volume, 0.3);
  facade.player.muted = false;
  facade.player.volume = 0.4;
  assert.deepEqual(audio, { muted: false, volume: 0.4 });
  assert.equal(content.volume, 0.8);
  registration.close();
  facade.player.muted = true;
  facade.player.volume = 0.6;
  assert.deepEqual([content.muted, content.volume], [true, 0.6]);
  facade.close();
});

for (const dispatch of ['dispatchEvent', 'dispatchPlayerEvent'] as const) {
  test(`${dispatch} player events bypass backing interceptors and stop after unregistering`, () => {
    const { content, facade, registration } = setupPauseEvents();
    const seen: unknown[] = [];
    let raw = 0;
    content.addEventListener('playing', () => raw++);
    registration.interceptPlayerEvent('playing', () => true);
    facade.player.addEventListener('playing', (event) => seen.push(event));
    const event = { type: 'playing' as const, date: new Date(), currentTime: 3 };
    const emit: typeof registration.dispatchPlayerEvent = registration[dispatch];
    emit(event);
    assert.deepEqual(seen, [event]);
    assert.equal(raw, 0);
    registration.close();
    const replacement = facade.player.registerIntegration({});
    const emitReplacement: typeof replacement.dispatchPlayerEvent = replacement[dispatch];
    emit(event);
    assert.deepEqual(seen, [event]);
    emitReplacement(event);
    assert.deepEqual(seen, [event, event]);
    facade.close();
    emitReplacement(event);
    assert.deepEqual(seen, [event, event]);
  });
}

test('unified dispatch routes player and ad events to separate listener surfaces', () => {
  const { facade, registration, ad } = setup();
  const playerEvents: unknown[] = [];
  const adEvents: unknown[] = [];
  facade.player.addEventListener(['waiting', 'volumechange', 'timeupdate'], (event) => playerEvents.push(event));
  facade.player.ads.addEventListener(['adbegin', 'adclicked'], (event) => adEvents.push(event));
  const date = new Date();
  const events = [
    { type: 'waiting' as const, date, currentTime: 3 },
    { type: 'volumechange' as const, date, volume: 0.4 },
    { type: 'timeupdate' as const, date, currentTime: 4, currentProgramDateTime: undefined },
  ];
  for (const event of events) registration.dispatchEvent(event);
  assert.deepEqual(playerEvents, events);
  assert.deepEqual(adEvents, []);
  const adEvent = { type: 'adclicked' as const, date, ad };
  registration.dispatchEvent(adEvent);
  assert.deepEqual(adEvents, [adEvent]);
  assert.deepEqual(playerEvents, events);
  facade.close();
});

for (const type of ['playing', 'adbegin'] as const) {
  for (const action of ['remove', 'unregister', 'destroy'] as const) {
    test(`unified ${type} dispatch respects listener ${action} during delivery`, () => {
      const { facade, registration, ad } = setup();
      const seen: string[] = [];
      const second = () => seen.push('second');
      const first = () => {
        seen.push('first');
        if (action === 'remove') {
          if (type === 'playing') facade.player.removeEventListener(type, second);
          else facade.player.ads.removeEventListener(type, second);
        } else if (action === 'unregister') registration.close();
        else facade.close();
      };
      if (type === 'playing') {
        facade.player.addEventListener(type, first);
        facade.player.addEventListener(type, second);
      } else {
        facade.player.ads.addEventListener(type, first);
        facade.player.ads.addEventListener(type, second);
      }
      registration.dispatchEvent({ type, date: new Date(), currentTime: 3, ad });
      assert.deepEqual(seen, ['first']);
      facade.close();
    });
  }
}

test('public API exposes Integration without facade implementation types', () => {
  const entryPoint = path.resolve('src/index.tsx');
  const program = ts.createProgram([entryPoint], { noEmit: true, jsx: ts.JsxEmit.ReactNative });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entryPoint);
  assert.ok(source);
  const symbol = checker.getSymbolAtLocation(source);
  assert.ok(symbol);
  const exports = new Set(checker.getExportsOfModule(symbol).map((entry) => entry.getName()));
  assert.ok(exports.has('Integration'));
  for (const name of ['PlayerFacade', 'IntegrationRegistration', 'PlayerFacadeAdsEventMap']) {
    assert.equal(exports.has(name), false, `${name} must remain internal`);
  }
});

test('custom adclicked preserves the active ad and its clock', () => {
  const { facade, registration, ad, state } = setup();
  state.playing = true;
  state.currentAds = [ad];
  const received: unknown[] = [];
  facade.player.ads.addEventListener('adclicked', (event) => {
    received.push(event);
  });
  registration.dispatchEvent({ type: 'adbegin', date: new Date(), ad });
  const event = { type: 'adclicked' as const, date: new Date(), ad };
  registration.dispatchEvent(event);
  assert.deepEqual(received, [event]);
  assert.deepEqual(facade.player.ads.currentAds, [ad]);
  assert.equal(facade.player.ads.playing, true);
  assert.equal(facade.player.currentTime, 2);
  facade.close();
});

test('closed integrations cannot dispatch clicks and native subscriptions are released', () => {
  const { facade, registration, ad, added, removed } = setup();
  const received: unknown[] = [];
  facade.player.ads.addEventListener('adclicked', (event) => {
    received.push(event);
  });
  registration.close();
  registration.dispatchEvent({ type: 'adclicked', date: new Date(), ad });
  assert.deepEqual(received, []);
  facade.close();
  assert.deepEqual(removed, added);
});
