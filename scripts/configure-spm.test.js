const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const script = path.join(__dirname, 'configure-spm.js');

function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'theoplayer-spm-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'ios'));
  const appPackage = { swiftpmConfig: { modules: [{ name: 'THEOplayerFeatures', path: 'ios/THEOplayerFeatures' }] } };
  const packageFile = path.join(root, 'package.json');
  fs.writeFileSync(packageFile, JSON.stringify(appPackage));
  return {
    root,
    packageFile,
    manifestFile: path.join(root, 'ios/THEOplayerFeatures/Package.swift'),
    sourceFile: path.join(root, 'ios/THEOplayerFeatures/Sources/THEOplayerFeatures/THEOplayerFeatures.swift'),
    configure(features, args = []) {
      fs.writeFileSync(path.join(root, 'react-native-theoplayer.json'), JSON.stringify({ ios: { features } }));
      return spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: 'utf8' });
    },
  };
}

test('changing JSON enables and disables IMA without changing app registration', (t) => {
  const app = setup(t);
  const registration = fs.readFileSync(app.packageFile, 'utf8');
  assert.equal(app.configure(['GOOGLE_IMA']).status, 0);
  assert.match(fs.readFileSync(app.manifestFile, 'utf8'), /traits: \["GoogleIMA"\]/);
  assert.match(fs.readFileSync(app.sourceFile, 'utf8'), /import ReactNativeTHEOplayer/);

  assert.equal(app.configure([]).status, 0);
  assert.match(fs.readFileSync(app.manifestFile, 'utf8'), /traits: \[\]/);
  assert.equal(fs.readFileSync(app.packageFile, 'utf8'), registration);
});

for (const [features, expectedTraits] of [
  [['THEO_ADS'], ['THEOads']],
  [['MILLICAST'], ['Millicast']],
  [['SIDELOADED_TEXTTRACKS'], ['SideloadedTextTracks']],
  [
    ['GOOGLE_IMA', 'THEO_ADS'],
    ['GoogleIMA', 'THEOads'],
  ],
  [
    ['GOOGLE_IMA', 'MILLICAST'],
    ['GoogleIMA', 'Millicast'],
  ],
  [
    ['THEO_ADS', 'MILLICAST'],
    ['THEOads', 'Millicast'],
  ],
  [
    ['GOOGLE_IMA', 'THEO_ADS', 'MILLICAST'],
    ['GoogleIMA', 'THEOads', 'Millicast'],
  ],
  [
    ['GOOGLE_IMA', 'THEO_ADS', 'MILLICAST', 'SIDELOADED_TEXTTRACKS'],
    ['GoogleIMA', 'THEOads', 'Millicast', 'SideloadedTextTracks'],
  ],
]) {
  test(`JSON features ${features.join(', ')} select the corresponding traits`, (t) => {
    const app = setup(t);
    const result = app.configure(features);
    assert.equal(result.status, 0, result.stderr);
    const manifest = fs.readFileSync(app.manifestFile, 'utf8');
    assert.deepEqual(JSON.parse(manifest.match(/traits: (\[[^\]]*\])/)[1]), expectedTraits);
    assert.match(result.stdout, /THEOlive is always included/);
  });
}

test('reordered and duplicate features do not rewrite an equivalent selection', (t) => {
  const app = setup(t);
  assert.equal(app.configure(['MILLICAST', 'THEO_ADS', 'GOOGLE_IMA', 'THEO_ADS']).status, 0);
  const manifest = fs.readFileSync(app.manifestFile, 'utf8');
  assert.deepEqual(JSON.parse(manifest.match(/traits: (\[[^\]]*\])/)[1]), ['GoogleIMA', 'THEOads', 'Millicast']);
  const oldTime = new Date('2000-01-01T00:00:00Z');
  fs.utimesSync(app.manifestFile, oldTime, oldTime);
  assert.equal(app.configure(['GOOGLE_IMA', 'THEO_ADS', 'MILLICAST']).status, 0);
  assert.equal(fs.statSync(app.manifestFile).mtimeMs, oldTime.getTime());
});

test('removing features removes stale traits from the generated selector', (t) => {
  const app = setup(t);
  for (const [features, expectedTraits] of [
    [
      ['GOOGLE_IMA', 'THEO_ADS', 'MILLICAST', 'SIDELOADED_TEXTTRACKS'],
      ['GoogleIMA', 'THEOads', 'Millicast', 'SideloadedTextTracks'],
    ],
    [['THEO_ADS'], ['THEOads']],
    [[], []],
  ]) {
    assert.equal(app.configure(features).status, 0);
    const manifest = fs.readFileSync(app.manifestFile, 'utf8');
    assert.deepEqual(JSON.parse(manifest.match(/traits: (\[[^\]]*\])/)[1]), expectedTraits);
  }
});

const supportedFeatures = ['GOOGLE_IMA', 'THEO_ADS', 'MILLICAST', 'SIDELOADED_TEXTTRACKS'];
for (let selection = 0; selection < 2 ** supportedFeatures.length; selection++) {
  const features = supportedFeatures.filter((_, index) => selection & (1 << index));
  test(`selector explicitly references only selected native SDKs for ${features.join(', ') || 'no features'}`, (t) => {
    const app = setup(t);
    assert.equal(app.configure(features).status, 0);
    const manifest = fs.readFileSync(app.manifestFile, 'utf8');
    const playerManifest = fs.readFileSync(path.join(__dirname, '../Package.swift'), 'utf8');
    assert.match(manifest, /platforms: \[\.iOS\("16\.0"\)\]/);
    assert.match(playerManifest, /platforms: \[\.iOS\("16\.0"\)\]/);
    for (const [selected, product, packageName, requirement] of [
      [
        features.includes('GOOGLE_IMA') || features.includes('THEO_ADS'),
        'GoogleInteractiveMediaAds',
        'swift-package-manager-google-interactive-media-ads-ios',
        '.upToNextMajor(from: "3.31.0")',
      ],
      [features.includes('MILLICAST'), 'MillicastSDK', 'millicast-sdk-swift-package', '.upToNextMinor(from: "2.7.0")'],
      [features.includes('SIDELOADED_TEXTTRACKS'), 'THEOplayerConnectorSideloadedSubtitle', 'ios-connector', '.upToNextMajor(from: "11.0.2")'],
    ]) {
      assert.equal(manifest.includes(`name: "${product}"`), selected);
      assert.equal(manifest.includes(`package: "${packageName}"`), selected);
      assert.equal(manifest.toLowerCase().includes(`/${packageName.toLowerCase()}"`), selected);
      assert.equal(manifest.includes(requirement), selected);
      assert.ok(playerManifest.includes(requirement), 'Selector and player must use the same native SDK requirements');
    }
    assert.equal(app.configure([]).status, 0);
    const disabledManifest = fs.readFileSync(app.manifestFile, 'utf8');
    assert.doesNotMatch(disabledManifest, /GoogleInteractiveMediaAds|MillicastSDK|THEOplayerConnectorSideloadedSubtitle|https:\/\/github.com/);
  });
}

test('switching advertising integrations keeps one shared IMA SDK requirement', (t) => {
  const app = setup(t);
  for (const features of [['GOOGLE_IMA', 'THEO_ADS'], ['THEO_ADS'], ['GOOGLE_IMA']]) {
    assert.equal(app.configure(features).status, 0);
    const manifest = fs.readFileSync(app.manifestFile, 'utf8');
    assert.match(manifest, /\.upToNextMajor\(from: "3\.31\.0"\)/);
    assert.doesNotMatch(manifest, /3\.18\.0|exact: "3\.33\.0"/);
    assert.equal((manifest.match(/name: "GoogleInteractiveMediaAds"/g) ?? []).length, 1);
  }
});

function prepareSync(app, exitCode = 0, cliPath = 'cli.js') {
  const packageRoot = path.join(app.root, 'node_modules/react-native');
  const cliFile = path.join(packageRoot, cliPath);
  const syncFile = path.join(app.root, 'ios/ReactNativeSPM/Scripts/sync-autolinking.sh');
  const invocationFile = path.join(app.root, 'sync-invocation.json');
  fs.mkdirSync(path.dirname(cliFile), { recursive: true });
  fs.mkdirSync(path.dirname(syncFile), { recursive: true });
  fs.writeFileSync(
    path.join(packageRoot, 'package.json'),
    JSON.stringify({ name: 'react-native', bin: { 'react-native': cliPath }, exports: { './package.json': './package.json' } }),
  );
  fs.writeFileSync(syncFile, '# Test fixture for an existing RN SPM setup.\n');
  fs.writeFileSync(
    cliFile,
    `const fs = require('node:fs');
fs.writeFileSync('sync-invocation.json', JSON.stringify({
  args: process.argv.slice(2),
  cwd: process.cwd(),
  manifest: fs.readFileSync('ios/THEOplayerFeatures/Package.swift', 'utf8'),
  package: JSON.parse(fs.readFileSync('package.json', 'utf8'))
}));
console.log('Fixture RN sync output');
process.exitCode = ${exitCode};
`,
  );
  return { invocationFile, syncFile, cliFile };
}

test('--sync invokes the installed RN CLI after generating and registering the selector', (t) => {
  const app = setup(t);
  fs.writeFileSync(app.packageFile, '{}');
  const { invocationFile } = prepareSync(app);
  const result = app.configure(['GOOGLE_IMA'], ['--sync']);
  assert.equal(result.status, 0, result.stderr);
  const invocation = JSON.parse(fs.readFileSync(invocationFile, 'utf8'));
  assert.deepEqual(invocation.args, ['spm', 'sync']);
  assert.equal(fs.realpathSync(invocation.cwd), fs.realpathSync(app.root));
  assert.match(invocation.manifest, /traits: \["GoogleIMA"\]/);
  assert.deepEqual(invocation.package.swiftpmConfig.modules, [{ name: 'THEOplayerFeatures', path: 'ios/THEOplayerFeatures' }]);
  assert.match(result.stdout, /Fixture RN sync output/);
  assert.doesNotMatch(result.stdout, /Next: npx/);
});

test('--sync respects the CLI path declared in React Native package metadata', (t) => {
  const app = setup(t);
  const { invocationFile } = prepareSync(app, 0, 'bin/react-native.js');
  const result = app.configure([], ['--sync']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(invocationFile), true);
});

test('--sync refuses missing CLI executables before modifying configuration', (t) => {
  const app = setup(t);
  const { cliFile } = prepareSync(app);
  fs.unlinkSync(cliFile);
  const result = app.configure([], ['--sync']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Cannot find the app-installed React Native CLI/);
  assert.equal(fs.existsSync(app.manifestFile), false);
});

test('--sync propagates RN failure while retaining the generated configuration', (t) => {
  const app = setup(t);
  prepareSync(app, 7);
  const result = app.configure([], ['--sync']);
  assert.equal(result.status, 7);
  assert.match(result.stderr, /sync failed with exit code 7/);
  assert.match(fs.readFileSync(app.manifestFile, 'utf8'), /traits: \[\]/);
});

test('--sync does not run RN when configuration validation fails', (t) => {
  const app = setup(t);
  const { invocationFile } = prepareSync(app);
  const result = app.configure(['UNKNOWN_FEATURE'], ['--sync']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unsupported experimental SPM features/);
  assert.equal(fs.existsSync(invocationFile), false);
  assert.equal(fs.existsSync(app.manifestFile), false);
});

test('--sync refuses apps without RN SPM setup before modifying files', (t) => {
  const app = setup(t);
  fs.writeFileSync(app.packageFile, '{}');
  const result = app.configure(['GOOGLE_IMA'], ['--sync']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /requires an existing React Native SPM setup/);
  assert.equal(fs.readFileSync(app.packageFile, 'utf8'), '{}');
  assert.equal(fs.existsSync(app.manifestFile), false);
});

test('--sync refuses a missing installed RN CLI before modifying files', (t) => {
  const app = setup(t);
  const syncFile = path.join(app.root, 'ios/ReactNativeSPM/Scripts/sync-autolinking.sh');
  fs.mkdirSync(path.dirname(syncFile), { recursive: true });
  fs.writeFileSync(syncFile, '# Test fixture.\n');
  const result = app.configure([], ['--sync']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Cannot find the app-installed React Native CLI/);
  assert.equal(fs.existsSync(app.manifestFile), false);
});

test('unknown options fail without generating configuration', (t) => {
  const app = setup(t);
  const result = app.configure([], ['--syn']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage:/);
  assert.equal(fs.existsSync(app.manifestFile), false);
});

test('help describes the npm command without requiring app configuration or writing files', (t) => {
  const app = setup(t);
  const registration = fs.readFileSync(app.packageFile, 'utf8');
  for (const option of ['--help', '-h']) {
    const result = spawnSync(process.execPath, [script, option], { cwd: app.root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage: theoplayer-features-spm \[--sync\]/);
    assert.match(result.stdout, /GOOGLE_IMA/);
    assert.match(result.stdout, /THEO_ADS/);
    assert.match(result.stdout, /MILLICAST/);
    assert.match(result.stdout, /SIDELOADED_TEXTTRACKS/);
    assert.match(result.stdout, /iOS 16 or later/);
    assert.match(result.stdout, /THEOlive is always included/);
    assert.equal(fs.readFileSync(app.packageFile, 'utf8'), registration);
    assert.equal(fs.existsSync(app.manifestFile), false);
  }
});

test('unchanged configuration preserves generated file timestamps', (t) => {
  const app = setup(t);
  assert.equal(app.configure(['GOOGLE_IMA']).status, 0);
  const oldTime = new Date('2000-01-01T00:00:00Z');
  for (const file of [app.manifestFile, app.sourceFile, app.packageFile]) {
    fs.utimesSync(file, oldTime, oldTime);
  }
  assert.equal(app.configure(['GOOGLE_IMA']).status, 0);
  for (const file of [app.manifestFile, app.sourceFile, app.packageFile]) {
    assert.equal(fs.statSync(file).mtimeMs, oldTime.getTime());
  }
});

test('invalid and unsupported features fail without changing generated files', (t) => {
  const app = setup(t);
  assert.equal(app.configure([]).status, 0);
  const original = fs.readFileSync(app.manifestFile, 'utf8');
  for (const features of ['GOOGLE_IMA', [null], ['UNKNOWN_FEATURE'], ['__proto__']]) {
    const result = app.configure(features);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /THEOplayer SPM configuration failed/);
    assert.equal(fs.readFileSync(app.manifestFile, 'utf8'), original);
  }
});

test('missing RN configuration is registered and stays unchanged on repeated runs', (t) => {
  const app = setup(t);
  fs.writeFileSync(app.packageFile, '{\n\t"name": "test-app",\n\t"scripts": { "postinstall": "existing-command" }\n}\n');
  assert.equal(app.configure(['GOOGLE_IMA']).status, 0);
  const contents = fs.readFileSync(app.packageFile, 'utf8');
  const updated = JSON.parse(contents);
  assert.deepEqual(updated, {
    name: 'test-app',
    scripts: { postinstall: 'existing-command' },
    swiftpmConfig: { modules: [{ name: 'THEOplayerFeatures', path: 'ios/THEOplayerFeatures' }] },
  });
  assert.match(contents, /^\{\n\t"name"/);
  assert.equal(app.configure(['GOOGLE_IMA']).status, 0);
  assert.equal(fs.readFileSync(app.packageFile, 'utf8'), contents);
});

test('registration preserves other SwiftPM settings, modules, and CRLF line endings', (t) => {
  const app = setup(t);
  const existingModule = { name: 'OtherModule', path: 'ios/OtherModule', exclude: ['Tests'] };
  const existing = { swiftpmConfig: { denyPlugins: ['some-plugin'], modules: [existingModule] } };
  fs.writeFileSync(app.packageFile, JSON.stringify(existing, null, 4).replace(/\n/g, '\r\n') + '\r\n');
  assert.equal(app.configure([]).status, 0);
  const contents = fs.readFileSync(app.packageFile, 'utf8');
  assert.deepEqual(JSON.parse(contents).swiftpmConfig, {
    denyPlugins: ['some-plugin'],
    modules: [existingModule, { name: 'THEOplayerFeatures', path: 'ios/THEOplayerFeatures' }],
  });
  assert.match(contents, /^\{\r\n {4}"swiftpmConfig"/);
  assert.equal(contents.replace(/\r\n/g, '').includes('\n'), false);
});

test('existing equivalent module paths do not cause duplicate registration', (t) => {
  const app = setup(t);
  const contents = JSON.stringify({
    swiftpmConfig: { modules: [{ name: 'THEOplayerFeatures', path: './ios/THEOplayerFeatures/' }] },
  });
  fs.writeFileSync(app.packageFile, contents);
  assert.equal(app.configure([]).status, 0);
  assert.equal(fs.readFileSync(app.packageFile, 'utf8'), contents);
});

test('conflicting registrations fail without modifying app files', (t) => {
  const app = setup(t);
  const correct = { name: 'THEOplayerFeatures', path: 'ios/THEOplayerFeatures' };
  for (const modules of [
    [{ name: 'THEOplayerFeatures', path: 'ios/CustomFeatures' }],
    [{ name: 'OtherFeatures', path: 'ios/THEOplayerFeatures' }],
    [{ name: 'theoplayerfeatures', path: 'ios/THEOplayerFeatures' }],
    [correct, correct],
  ]) {
    const contents = JSON.stringify({ swiftpmConfig: { modules } });
    fs.writeFileSync(app.packageFile, contents);
    const result = app.configure(['GOOGLE_IMA']);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Conflicting swiftpmConfig.modules/);
    assert.equal(fs.readFileSync(app.packageFile, 'utf8'), contents);
    assert.equal(fs.existsSync(app.manifestFile), false);
  }
});

test('malformed SwiftPM configuration is not replaced', (t) => {
  const app = setup(t);
  for (const swiftpmConfig of [null, [], 'invalid', { modules: null }, { modules: {} }]) {
    const contents = JSON.stringify({ swiftpmConfig });
    fs.writeFileSync(app.packageFile, contents);
    const result = app.configure([]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /swiftpmConfig/);
    assert.equal(fs.readFileSync(app.packageFile, 'utf8'), contents);
    assert.equal(fs.existsSync(app.manifestFile), false);
  }
});

test('invalid features do not add registration', (t) => {
  const app = setup(t);
  const contents = '{"name":"test-app"}';
  fs.writeFileSync(app.packageFile, contents);
  const result = app.configure(['UNKNOWN_FEATURE']);
  assert.equal(result.status, 1);
  assert.equal(fs.readFileSync(app.packageFile, 'utf8'), contents);
  assert.equal(fs.existsSync(app.manifestFile), false);
});

test('missing ios directory does not add registration', (t) => {
  const app = setup(t);
  fs.rmdirSync(path.join(app.root, 'ios'));
  const contents = '{}';
  fs.writeFileSync(app.packageFile, contents);
  const result = app.configure(['GOOGLE_IMA']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ios directory/);
  assert.equal(fs.readFileSync(app.packageFile, 'utf8'), contents);
  assert.equal(fs.existsSync(app.manifestFile), false);
});
