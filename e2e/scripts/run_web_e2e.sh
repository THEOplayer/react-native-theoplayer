#!/usr/bin/env bash
# Starts the webpack dev server and opens the test app in a dedicated Chrome
# instance.
#
# The separate user-data-dir forces a fresh Chrome instance so the flags take
# effect: without them, Chrome throttles timers and pauses playback in
# backgrounded tabs, which stalls the test run.
set -euo pipefail

APP_URL="http://localhost:8080"
USER_DATA_DIR="${TMPDIR:-/tmp}/cavynext-e2e-chrome"

if [[ -n "${E2E_BROWSER_BIN:-}" ]]; then
  BROWSER_BIN="${E2E_BROWSER_BIN}"
elif [[ "$(uname)" == "Darwin" ]]; then
  BROWSER_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
else
  BROWSER_BIN="$(command -v google-chrome || command -v chromium-browser || command -v chromium || true)"
  if [[ -z "${BROWSER_BIN}" ]]; then
    echo "No Chrome/Chromium binary found; set E2E_BROWSER_BIN to point at one." >&2
    exit 1
  fi
fi

# On CI there is no display; run Chrome headless.
EXTRA_FLAGS=()
if [[ -n "${CI:-}" ]]; then
  EXTRA_FLAGS=(--headless=new --no-sandbox --disable-gpu --window-size=1280,720)
fi

BROWSER_PID=""
WEBPACK_PID=""

# Kills a process and everything it spawned: `npx` and the browser launcher
# both wrap the process that actually has to go away.
kill_tree() {
  local pid=$1 child
  for child in $(pgrep -P "${pid}" 2>/dev/null); do
    kill_tree "${child}"
  done
  kill "${pid}" 2>/dev/null || true
}

cleanup() {
  trap - EXIT INT TERM
  for pid in "${BROWSER_PID}" "${WEBPACK_PID}"; do
    if [[ -n "${pid}" ]]; then
      kill_tree "${pid}"
    fi
  done
}
trap cleanup EXIT INT TERM

npx webpack serve --mode development --config web/webpack.config.js &
WEBPACK_PID=$!

# Wait until webpack's dev server accepts connections, then open the browser.
for _ in $(seq 1 60); do
  if curl -sf -o /dev/null "${APP_URL}"; then
    break
  fi
  sleep 1
done
rm -rf "${USER_DATA_DIR}"
"${BROWSER_BIN}" \
  --user-data-dir="${USER_DATA_DIR}" \
  --no-first-run \
  --no-default-browser-check \
  --disable-background-timer-throttling \
  --disable-backgrounding-occluded-windows \
  --disable-renderer-backgrounding \
  --autoplay-policy=no-user-gesture-required \
  ${EXTRA_FLAGS[@]+"${EXTRA_FLAGS[@]}"} \
  "${APP_URL}" &
BROWSER_PID=$!

# Stay alive as long as the dev server runs: the cavynext CLI stops this script
# when the test run ends, and the trap then takes the browser down with it.
wait "${WEBPACK_PID}"
