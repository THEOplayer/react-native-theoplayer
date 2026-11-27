const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

test('the player manifest locates React Native from a normal npm installation', { skip: process.platform !== 'darwin' }, (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'theoplayer-spm-path-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const app = path.join(root, 'app');
  const binaries = path.join(app, 'ios/build/xcframeworks');
  const installed = path.join(app, 'node_modules/react-native-theoplayer');
  for (const directory of [binaries, installed]) {
    fs.mkdirSync(directory, { recursive: true });
  }
  fs.writeFileSync(path.join(binaries, 'Package.swift'), '// React Native fixture\n');
  const manifest = fs.readFileSync(path.join(__dirname, '../Package.swift'), 'utf8');
  fs.writeFileSync(path.join(installed, 'Package.swift'), manifest);
  const result = spawnSync('swift', ['package', '--package-path', installed, 'dump-package'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const dependencies = JSON.parse(result.stdout).dependencies.flatMap((dependency) => dependency.fileSystem ?? []);
  assert.equal(fs.realpathSync(dependencies.find((dependency) => dependency.identity === 'xcframeworks')?.path), fs.realpathSync(binaries));
});
