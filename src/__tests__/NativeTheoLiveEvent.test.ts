import type { NativeSyntheticEvent } from 'react-native';
import type { NativeTheoLiveEvent } from '../internal/adapter/event/native/NativeTheoLiveEvent';

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const modules = new Map<string, object>();

function loadSource(file: string): object {
  const cached = modules.get(file);
  if (cached) return cached;
  const compiled = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  modules.set(file, exports);
  new Function('exports', 'require', compiled.outputText)(exports, (specifier: string) => {
    if (specifier === 'react-native-theoplayer') {
      return {
        ...loadSource(path.resolve('src/api/player/PlayerEventMap.ts')),
        ...loadSource(path.resolve('src/api/event/TheoLiveEvent.ts')),
      };
    }
    assert.ok(specifier.startsWith('.'), 'Event adapter runtime imports must remain local');
    return loadSource(path.resolve(path.dirname(file), `${specifier}.ts`));
  });
  return exports;
}

const { fromNativeTheoLiveEvent } = loadSource(
  path.resolve('src/internal/adapter/event/native/NativeTheoLiveEvent.ts'),
) as typeof import('../internal/adapter/event/native/NativeTheoLiveEvent');
const { DefaultTheoLiveEndpointLoadedEvent, DefaultTheoLiveDistributionEvent, DefaultTheoLiveIntentToFallbackEvent, DefaultTheoLiveEvent } =
  loadSource(path.resolve('src/internal/adapter/event/PlayerEvents.ts')) as typeof import('../internal/adapter/event/PlayerEvents');
const { TheoLiveEventType } = loadSource(path.resolve('src/api/event/TheoLiveEvent.ts')) as typeof import('../api/event/TheoLiveEvent');

function nativeEvent(payload: Partial<NativeTheoLiveEvent> & Pick<NativeTheoLiveEvent, 'type'>) {
  return fromNativeTheoLiveEvent({
    type: 'nativetheoliveevent',
    nativeEvent: payload,
  } as NativeSyntheticEvent<NativeTheoLiveEvent>);
}

test('New Architecture endpointloaded preserves the endpoint', () => {
  const endpoint = { provider: 'mediakind', hlsSrc: 'https://cdn.example.com/live.m3u8', weight: 1, priority: 1 };
  const event = nativeEvent({ type: TheoLiveEventType.ENDPOINT_LOADED, endpoint });
  assert.ok(event instanceof DefaultTheoLiveEndpointLoadedEvent);
  assert.equal(event.type, 'theolive');
  assert.equal(event.subType, TheoLiveEventType.ENDPOINT_LOADED);
  assert.equal(event.endpoint, endpoint);
});

test('New Architecture distributionloadstart preserves the distribution identifier', () => {
  const event = nativeEvent({ type: TheoLiveEventType.DISTRIBUTION_LOAD_START, distributionId: 'distribution-1' });
  assert.ok(event instanceof DefaultTheoLiveDistributionEvent);
  assert.equal(event.subType, TheoLiveEventType.DISTRIBUTION_LOAD_START);
  assert.equal(event.distributionId, 'distribution-1');
});

test('New Architecture distributionloadstart defaults a missing distribution identifier', () => {
  const event = nativeEvent({ type: TheoLiveEventType.DISTRIBUTION_LOAD_START });
  assert.ok(event instanceof DefaultTheoLiveDistributionEvent);
  assert.equal(event.subType, TheoLiveEventType.DISTRIBUTION_LOAD_START);
  assert.equal(event.distributionId, '');
});

test('New Architecture intenttofallback preserves the error reason', () => {
  const reason = { errorCode: 'NETWORK_ERROR', errorMessage: 'Endpoint unavailable' };
  const event = nativeEvent({ type: TheoLiveEventType.INTENT_TO_FALLBACK, reason });
  assert.ok(event instanceof DefaultTheoLiveIntentToFallbackEvent);
  assert.equal(event.subType, TheoLiveEventType.INTENT_TO_FALLBACK);
  assert.equal(event.reason, reason);
});

test('New Architecture generic events preserve the native subtype', () => {
  const event = nativeEvent({ type: 'futureevent' as NativeTheoLiveEvent['type'] });
  assert.ok(event instanceof DefaultTheoLiveEvent);
  assert.equal(event.subType, 'futureevent');
});
