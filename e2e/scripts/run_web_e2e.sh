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
  BROWSER_BIN="$(command -v google-chrome || command -v chromium-browser || command -v chromium)"
fi

# Give webpack time to come up, then open the browser. Runs alongside the dev
# server; the browser is cleaned up when this script is terminated.
(
  sleep 8
  rm -rf "${USER_DATA_DIR}"
  "${BROWSER_BIN}" \
    --user-data-dir="${USER_DATA_DIR}" \
    --no-first-run \
    --no-default-browser-check \
    --disable-background-timer-throttling \
    --disable-backgrounding-occluded-windows \
    --disable-renderer-backgrounding \
    --autoplay-policy=no-user-gesture-required \
    "${APP_URL}" &
  BROWSER_PID=$!
  trap 'kill "${BROWSER_PID}" 2>/dev/null || true' EXIT
  wait "${BROWSER_PID}"
) &

exec npx webpack serve --mode development --config web/webpack.config.js
