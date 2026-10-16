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
  const buildIntegration = (integrationId: string, keySystemId: string, integrationInstanceId?: string) =>
    emitter.listeners.get('onBuildIntegration')?.({ requestId: '1', integrationId, keySystemId, integrationInstanceId, drmConfig: {} } as never);
  const emit = (eventType: string, event: object): Promise<void> | void => emitter.listeners.get(eventType)?.(event as never) as Promise<void> | void;
  return { registry, emitter, buildIntegration, emit };
}

const licenseRequest = (integrationId: string, keySystemId: string, integrationInstanceId?: string) => ({
  requestId: 'req-1',
  integrationId,
  keySystemId,
  integrationInstanceId,
  url: 'https://license.server/',
  method: 'GET',
  headers: {},
  base64body: null,
  useCredentials: false,
  fairplaySkdUrl: undefined,
});

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

test('callbacks are routed to the integration instance matching the event instance identifier', async () => {
  const { registry, buildIntegration, emit } = setup();
  const calls: string[] = [];
  const handledRequest = (tag: string) => () => {
    calls.push(tag);
    return { url: `handled-by-${tag}`, method: 'GET', headers: {}, body: null, useCredentials: false };
  };
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, {
    build: () => ({ onLicenseRequest: handledRequest('instance-a') }),
  });
  registry.registerContentProtectionIntegration('drm', 'fairplay' as never, {
    build: () => ({ onLicenseRequest: handledRequest('instance-b') }),
  });

  buildIntegration('drm', 'widevine', 'instance-a');
  buildIntegration('drm', 'fairplay', 'instance-b');

  await emit('onLicenseRequest', licenseRequest('drm', 'widevine', 'instance-a'));
  await emit('onLicenseRequest', licenseRequest('drm', 'fairplay', 'instance-b'));

  assert.deepEqual(calls, ['instance-a', 'instance-b']);
  const processed = nativeModuleCalls.filter((c) => c.method === 'onLicenseRequestProcessedAsRequest');
  assert.deepEqual(
    processed.map((c) => (c.args[0] as { url: string }).url),
    ['handled-by-instance-a', 'handled-by-instance-b'],
  );
});

test('building a second integration for the same integration id does not replace the first', async () => {
  const { registry, buildIntegration, emit } = setup();
  const calls: string[] = [];
  let count = 0;
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, {
    build: () => {
      const tag = `built-${++count}`;
      return {
        onLicenseRequest: () => {
          calls.push(tag);
          return { url: `handled-by-${tag}` };
        },
      };
    },
  });

  buildIntegration('drm', 'widevine', 'instance-a');
  buildIntegration('drm', 'widevine', 'instance-b');

  await emit('onLicenseRequest', licenseRequest('drm', 'widevine', 'instance-a'));
  await emit('onLicenseRequest', licenseRequest('drm', 'widevine', 'instance-b'));

  assert.deepEqual(calls, ['built-1', 'built-2']);
});

test('disposing an integration removes it from the registry', async () => {
  const { registry, buildIntegration, emit } = setup();
  const calls: string[] = [];
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, {
    build: () => ({
      onLicenseRequest: () => {
        calls.push('handled');
        return { url: 'handled' };
      },
    }),
  });
  buildIntegration('drm', 'widevine', 'instance-a');
  emit('onIntegrationDisposed', { integrationId: 'drm', keySystemId: 'widevine', integrationInstanceId: 'instance-a' });

  await emit('onLicenseRequest', licenseRequest('drm', 'widevine', 'instance-a'));

  // The disposed integration must not handle the callback; the request passes through unmodified.
  assert.deepEqual(calls, []);
  const processed = nativeModuleCalls.filter((c) => c.method === 'onLicenseRequestProcessedAsRequest');
  assert.equal(processed.length, 1);
  assert.equal((processed[0].args[0] as { url: string }).url, 'https://license.server/');
});

test('events without an instance identifier keep the single-integration behaviour', async () => {
  const { registry, buildIntegration, emit } = setup();
  const calls: string[] = [];
  let count = 0;
  registry.registerContentProtectionIntegration('drm', 'widevine' as never, {
    build: () => {
      const tag = `built-${++count}`;
      return {
        onLicenseRequest: () => {
          calls.push(tag);
          return { url: `handled-by-${tag}` };
        },
      };
    },
  });

  buildIntegration('drm', 'widevine');
  buildIntegration('drm', 'widevine');

  await emit('onLicenseRequest', licenseRequest('drm', 'widevine'));

  assert.deepEqual(calls, ['built-2']);
});
