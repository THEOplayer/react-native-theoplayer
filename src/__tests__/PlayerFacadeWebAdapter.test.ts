import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import type { AdBreak, ChromelessPlayer } from 'theoplayer';
import ts from 'typescript';
import type { PlayerFacade } from '../internal/adapter/web/PlayerFacadeTypes';

function setup(enabled = true) {
  const actions = new Map<string, (event: { seekTime?: number }) => void>();
  const session = {
    position: undefined as MediaPositionState | undefined,
    playbackState: 'none',
    setActionHandler: (action: string, callback: (event: { seekTime?: number }) => void) => actions.set(action, callback),
    setPositionState: (state: MediaPositionState) => {
      session.position = state;
    },
  };
  const document = { visibilityState: 'visible', addEventListener: () => undefined, removeEventListener: () => undefined };
  const browser = { MediaMetadata: class {} };
  const root = path.resolve('src/internal/adapter');
  const actual = new Set([
    'THEOplayerWebAdapter.ts',
    'web/PlayerFacade.ts',
    'web/PlayerFacadeAdsEvents.ts',
    'web/WebMediaSession.ts',
    'media/MediaControlWebAdapter.ts',
  ]);
  const stubs = new Proxy(
    {},
    {
      get: () =>
        class {
          addEventListener() {
            return undefined;
          }
          dispatchEvent() {
            return undefined;
          }
          unload() {
            return undefined;
          }
          destroy() {
            return undefined;
          }
        },
    },
  );
  const api = { PlayerEventType: { DESTROY: 'destroy' }, MediaControlAction: { PLAY: 'play', PAUSE: 'pause' } };
  const modules = new Map<string, object>();
  const load = (file: string): object => {
    const cached = modules.get(file);
    if (cached) return cached;
    const exports = {};
    modules.set(file, exports);
    const compiled = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
    });
    new Function('exports', 'require', 'navigator', 'window', 'document', 'MediaMetadata', compiled.outputText)(
      exports,
      (specifier: string) => {
        if (specifier === 'react-native-theoplayer') return api;
        const target = path.resolve(path.dirname(file), `${specifier}.ts`);
        return actual.has(path.relative(root, target)) ? load(target) : stubs;
      },
      { mediaSession: session },
      browser,
      document,
      browser.MediaMetadata,
    );
    return exports;
  };
  const { THEOplayerWebAdapter } = load(path.join(root, 'THEOplayerWebAdapter.ts')) as typeof import('../internal/adapter/THEOplayerWebAdapter');
  const listeners = new Map<string, Set<(event: unknown) => void>>();
  const content = {
    currentTime: 100,
    duration: 600,
    playbackRate: 1,
    paused: false,
    calls: [] as string[],
    ads: { playing: false, addEventListener: () => undefined, removeEventListener: () => undefined },
    addEventListener(types: string | string[], listener: (event: unknown) => void) {
      for (const type of typeof types === 'string' ? [types] : types) {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type)!.add(listener);
      }
    },
    removeEventListener(types: string | string[], listener: (event: unknown) => void) {
      for (const type of typeof types === 'string' ? [types] : types) listeners.get(type)?.delete(listener);
    },
    emit(type: string) {
      for (const listener of [...(listeners.get(type) ?? [])]) listener({ type, date: new Date() });
    },
    pause() {
      this.calls.push('pause');
      this.paused = true;
    },
    play() {
      this.calls.push('play');
      this.paused = false;
    },
    destroy() {
      this.calls.push('destroy');
      this.emit('destroy');
    },
  };
  const adapter = new THEOplayerWebAdapter(content as unknown as ChromelessPlayer, { usePlayerFacade: enabled });
  const facade = adapter.nativeHandle as PlayerFacade;
  return { adapter, facade, content, session, actions };
}

test('media session uses facade clocks, commands, synthetic updates, and advertising state', () => {
  const { adapter, facade, content, session, actions } = setup();
  const commands: Array<string | number> = [];
  const state = { paused: false, currentTime: 2, playingAd: false };
  const registration = facade.registerIntegration({
    getCurrentTime: () => state.currentTime,
    getDuration: () => 30,
    isPaused: () => state.paused,
    getAdState: () => ({ playing: state.playingAd, currentAds: [], currentAdBreak: null }),
    pause: () => {
      commands.push('pause');
      return true;
    },
    play: () => {
      commands.push('play');
      return true;
    },
    setCurrentTime: (value) => {
      commands.push(value);
      state.currentTime = value;
      return true;
    },
  });
  content.emit('sourcechange');
  registration.dispatchEvent({ type: 'playing', date: new Date(), currentTime: 2 });
  registration.dispatchEvent({ type: 'durationchange', date: new Date(), duration: 30 });
  assert.deepEqual(session.position, { duration: 30, position: 2, playbackRate: 1 });
  actions.get('pause')!({});
  actions.get('play')!({});
  actions.get('seekto')!({ seekTime: 9 });
  assert.deepEqual(commands, ['pause', 'play', 9]);
  assert.deepEqual(content.calls, []);
  assert.equal(content.currentTime, 100);
  state.paused = true;
  registration.dispatchEvent({ type: 'pause', date: new Date(), currentTime: 9 });
  assert.equal(session.playbackState, 'paused');
  state.playingAd = true;
  registration.dispatchEvent({ type: 'adbreakbegin', date: new Date(), adBreak: {} as AdBreak });
  actions.get('pause')!({});
  actions.get('seekto')!({ seekTime: 10 });
  assert.deepEqual(commands, ['pause', 'play', 9]);
  registration.close();
  content.emit('pause');
  actions.get('pause')!({});
  assert.deepEqual(content.calls, ['pause']);
  adapter.destroy();
});

for (const enabled of [false, true]) {
  test(`wrapper destruction reaches native-handle listeners (facade=${enabled})`, () => {
    const { adapter, facade, content } = setup(enabled);
    let native = 0;
    let exposed = 0;
    content.addEventListener('destroy', () => native++);
    facade.addEventListener('destroy', () => exposed++);
    adapter.destroy();
    assert.equal(native, 1);
    assert.equal(exposed, 1);
    assert.equal(adapter.nativeHandle, undefined);
  });
}

for (const mode of ['no-event', 'throw-before-event', 'throw-listener', 'consume'] as const) {
  test(`wrapper destruction still closes facade when ${mode}`, () => {
    const { adapter, facade, content } = setup();
    const registration = facade.registerIntegration({});
    if (mode === 'no-event') content.destroy = () => undefined;
    if (mode === 'throw-before-event')
      content.destroy = () => {
        throw new Error('destroy failed');
      };
    if (mode === 'throw-listener')
      facade.addEventListener('destroy', () => {
        throw new Error('listener failed');
      });
    if (mode === 'consume') registration.interceptPlayerEvents(() => true);
    if (mode === 'throw-before-event' || mode === 'throw-listener') assert.throws(() => adapter.destroy(), /failed/);
    else adapter.destroy();
    assert.throws(() => facade.registerIntegration({}), /closed/);
    assert.equal(adapter.nativeHandle, undefined);
  });
}
