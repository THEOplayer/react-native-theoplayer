import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const nativeModuleCalls: { method: string; args: unknown[] }[] = [];
const createdEmitters: { listeners: Map<string, (event: never) => void> }[] = [];

const reactNativeStub = {
  NativeEventEmitter: class {
    listeners = new Map<string, (event: never) => void>();
    constructor() {
      createdEmitters.push(this);
    }
    addListener(eventType: string, listener: (event: never) => void) {
      this.listeners.set(eventType, listener);
      return { remove: () => this.listeners.delete(eventType) };
    }
  },
  NativeModules: {
    THEORCTContentProtectionModule: new Proxy({} as Record<string, (...args: unknown[]) => void>, {
      get: (target, method: string) =>
        (target[method] ??= (...args: unknown[]) => {
          nativeModuleCalls.push({ method, args });
        }),
    }),
  },
};

const theoplayerStub = {
  fromBase64StringToUint8Array: (str: string) => new Uint8Array(Buffer.from(str, 'base64')),
  fromUint8ArrayToBase64String: (array: Uint8Array) => Buffer.from(array).toString('base64'),
};

function loadSource(file: string): object {
  const compiled = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  new Function('exports', 'require', compiled.outputText)(exports, (specifier: string) => {
    if (specifier === 'react-native') {
      return reactNativeStub;
    }
    if (specifier === 'react-native-theoplayer') {
      return theoplayerStub;
    }
    assert.ok(specifier.startsWith('.'), 'Registry runtime imports must remain local');
    return loadSource(path.resolve(path.dirname(file), `${specifier}.ts`));
  });
  return exports;
}

const { NativeContentProtectionRegistry } = loadSource(
  path.resolve('src/internal/drm/ContentProtectionRegistry.ts'),
) as typeof import('../internal/drm/ContentProtectionRegistry');

function setup() {
  nativeModuleCalls.length = 0;
  createdEmitters.length = 0;
  const registry = new NativeContentProtectionRegistry();
  const emitter = createdEmitters[createdEmitters.length - 1];
  const buildIntegration = (integrationId: string, keySystemId: string) =>
    emitter.listeners.get('onBuildIntegration')?.({ requestId: '1', integrationId, keySystemId, drmConfig: {} } as never);
  return { registry, buildIntegration };
}

test('registerContentProtectionIntegration replaces a factory registered for the same integration and key system', () => {
  const { registry, buildIntegration } = setup();
  const built: string[] = [];
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, {
    build: () => {
      built.push('first');
      return {};
    },
  });
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, {
    build: () => {
      built.push('second');
      return {};
    },
  });

  buildIntegration('drm', 'widevine');

  // The stale factory must not handle the build request.
  assert.deepEqual(built, ['second']);
});

test('re-registering one key system does not affect factories for other key systems', () => {
  const { registry, buildIntegration } = setup();
  const built: string[] = [];
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, {
    build: () => {
      built.push('widevine-1');
      return {};
    },
  });
  registry.registerContentProtectionIntegration('drm', 'fairplay' as never, {
    build: () => {
      built.push('fairplay');
      return {};
    },
  });
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, {
    build: () => {
      built.push('widevine-2');
      return {};
    },
  });

  buildIntegration('drm', 'fairplay');
  buildIntegration('drm', 'widevine');

  assert.deepEqual(built, ['fairplay', 'widevine-2']);
});

test('each registration is still forwarded to the native module', () => {
  const { registry } = setup();
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, { build: () => ({}) });
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, { build: () => ({}) });

  const registrations = nativeModuleCalls.filter((c) => c.method === 'registerContentProtectionIntegration');
  assert.equal(registrations.length, 2);
});
