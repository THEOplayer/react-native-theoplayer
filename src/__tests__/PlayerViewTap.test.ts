import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';

interface Element {
  type: unknown;
  props: Record<string, any>;
  children: unknown[];
}

const root = path.resolve('src/internal');

function compile(file: string): string {
  return ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
  }).outputText;
}

function loadPlayerEventType(): Record<string, string> {
  const exports: { PlayerEventType?: Record<string, string> } = {};
  new Function('exports', 'require', compile(path.resolve('src/api/player/PlayerEventMap.ts')))(exports, () => ({}));
  return exports.PlayerEventType!;
}

const stub: any = new Proxy(function () {}, {
  get: (_target, property) => (property === 'default' ? stub : property === Symbol.toPrimitive ? () => '' : stub),
  apply: () => stub,
  construct: () => stub,
});

function createReact(hooks?: { effects: Array<() => void> }) {
  const React: any = {
    PureComponent: class {
      props: unknown;
      state: unknown;
      constructor(props: unknown) {
        this.props = props;
      }
    },
    createRef: () => ({ current: null }),
    createElement: (type: unknown, props: Record<string, any> | null, ...children: unknown[]): Element => ({ type, props: props ?? {}, children }),
    useRef: (initial: unknown) => ({ current: initial }),
    useEffect: (effect: () => void) => hooks?.effects.push(effect),
  };
  React.default = React;
  return React;
}

function createAdapterClass() {
  const instances: Array<{ dispatched: Array<{ type: string }> }> = [];
  class Adapter {
    dispatched: Array<{ type: string }> = [];
    constructor() {
      instances.push(this);
    }
    dispatchEvent(event: { type: string }) {
      this.dispatched.push(event);
    }
    destroy() {}
    willUnmount() {}
  }
  return { Adapter, instances };
}

function load(file: string, modules: Record<string, unknown>, globals: Record<string, unknown> = {}): any {
  const exports = {};
  const names = Object.keys(globals);
  new Function('exports', 'require', ...names, compile(file))(
    exports,
    (specifier: string) => {
      if (specifier in modules) return modules[specifier];
      if (specifier === './adapter/event/BaseEvent') {
        return load(path.join(root, 'adapter/event/BaseEvent.ts'), {});
      }
      return stub;
    },
    ...names.map((name) => globals[name]),
  );
  return exports;
}

function findAll(node: unknown, predicate: (element: Element) => boolean, found: Element[] = []): Element[] {
  if (Array.isArray(node)) {
    node.forEach((child) => findAll(child, predicate, found));
  } else if (node && typeof node === 'object' && 'props' in node) {
    const element = node as Element;
    if (predicate(element)) found.push(element);
    findAll(element.children, predicate, found);
  }
  return found;
}

function setupNative() {
  const PlayerEventType = loadPlayerEventType();
  const { Adapter, instances } = createAdapterClass();
  const reactNative = {
    ...Object.fromEntries(['findNodeHandle', 'StyleSheet', 'View', 'DeviceEventEmitter'].map((name) => [name, stub])),
    Platform: { OS: 'ios', select: () => '' },
    UIManager: { getViewManagerConfig: () => ({}) },
    requireNativeComponent: (name: string) => name,
  };
  const { THEOplayerView } = load(path.join(root, 'THEOplayerView.tsx'), {
    react: createReact(),
    'react-native': reactNative,
    'react-native-theoplayer': { PlayerEventType, PresentationMode: { inline: 'inline' }, CastEventType: {}, isDateRangeCue: () => false },
    './adapter/THEOplayerAdapter': { THEOplayerAdapter: Adapter },
  });
  const view = new THEOplayerView({});
  view.componentDidMount();
  const tree = view.render();
  const [nativeView] = findAll(tree, (element) => element.type === 'THEOplayerRCTView');
  return { PlayerEventType, adapter: instances[0]!, nativeView: nativeView! };
}

function setupWeb() {
  const PlayerEventType = loadPlayerEventType();
  const { Adapter, instances } = createAdapterClass();
  const hooks = { effects: [] as Array<() => void> };
  const { THEOplayerView } = load(
    path.join(root, 'THEOplayerView.web.tsx'),
    {
      react: createReact(hooks),
      theoplayer: { ChromelessPlayer: function () {} },
      './adapter/THEOplayerWebAdapter': { THEOplayerWebAdapter: Adapter },
      './hooks/useIsAttached': { useIsAttached: () => true },
      'react-native-theoplayer': { PlayerEventType },
    },
    { CSS: { supports: () => true }, window: {} },
  );
  const tree = THEOplayerView({ config: {} });
  const [container] = findAll(tree, (element) => element.props.className === 'theoplayer-container');
  container!.props.ref.current = {};
  hooks.effects.forEach((effect) => effect());
  return { PlayerEventType, adapter: instances[0]!, container: container! };
}

test('the player event type list includes a view tap event', () => {
  assert.equal(loadPlayerEventType().VIEW_TAP, 'viewtap');
});

test('native: a native view tap event dispatches a view tap event', () => {
  const { adapter, nativeView } = setupNative();
  assert.equal(typeof nativeView.props.onNativeViewTap, 'function');
  nativeView.props.onNativeViewTap({ nativeEvent: {} });
  assert.deepEqual(
    adapter.dispatched.map((event) => event.type),
    ['viewtap'],
  );
});

test('web: releasing the primary pointer on the player container dispatches a view tap event', () => {
  const { adapter, container } = setupWeb();
  assert.equal(typeof container.props.onPointerUp, 'function');
  container.props.onPointerUp({ button: 0 });
  assert.deepEqual(
    adapter.dispatched.map((event) => event.type),
    ['viewtap'],
  );
});

test('native: the poster lets taps through to the player view', () => {
  const { Poster } = load(path.join(root, 'poster/Poster.tsx'), {
    react: createReact(),
    'react-native': { StyleSheet: { absoluteFill: {} }, View: 'View', Image: 'Image' },
  });
  const poster = Poster({ uri: 'https://example.com/poster.jpg' });
  assert.equal(poster.type, 'View');
  assert.equal(poster.props.pointerEvents, 'none');
});

test('web: releasing a secondary mouse button does not dispatch a view tap event', () => {
  const { adapter, container } = setupWeb();
  container.props.onPointerUp?.({ button: 2 });
  assert.deepEqual(adapter.dispatched, []);
});
