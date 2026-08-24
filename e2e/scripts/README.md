# Local e2e test scripts

Helper scripts for running the react-native-theoplayer e2e suite locally.

> Run these from inside `e2e/scripts/` — they `cd ..` internally and rely on
> relative paths.

## iOS: `e2e_ios.sh`

Drives the iOS run through three stages:

- **prepare** (`prep_e2e_tests.sh`) — clears screenshots, reinstalls
  `node_modules` and Pods, and swaps in the test entry point (`index.test.js`
  becomes `index.js`, the original is backed up as `index_old.js`).
- **run** (`run_ios_e2e_tests.sh`) — builds and runs the suite on the iOS
  simulator via `cavynext`, writing output to `ios_output.txt`.
- **reset** (`reset_e2e_tests.sh`) — restores the original `index.js`, undoing
  the prepare stage.

### Usage

```sh
./e2e_ios.sh          # full cycle: prepare -> run -> reset
./e2e_ios.sh rerun    # run only (reuse an already prepared setup)
./e2e_ios.sh reset    # reset only (restore the original setup)
```

### Iterating quickly

`prepare` is the slow stage (`npm i`, `pod update`). Once it has run, the setup
persists, so you can retest repeatedly with `rerun`:

```sh
./e2e_ios.sh          # prepare once ... (runs and then resets)
# — or run prepare without the trailing reset, then:
./e2e_ios.sh rerun    # re-run as many times as you like
./e2e_ios.sh reset    # restore when finished
```

Editing test spec files (`src/tests/*.spec.ts`) between `rerun`s is fine —
`cavynext` rebuilds the JS bundle from source each run. A fresh `prepare` is
only needed after adding/upgrading npm dependencies or changing native code.

**Caveats while in the prepared state:**

- Do **not** run `reset` between `rerun`s — it swaps the stub entry point back,
  so the next run would launch the non-test app.
- Do **not** run `prepare` again before `reset` — it would overwrite the
  `index_old.js` backup with the (already swapped-in) test entry, losing the
  original.

## Web: `run_web_e2e.sh`

Used as the `buildCmd` for `cavynext run-web` (see the `test:e2e:web` npm
script). It starts the webpack dev server and opens the app in a dedicated
Chrome instance with autoplay/throttling flags suitable for the test run.
