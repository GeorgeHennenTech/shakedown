#!/bin/bash
# Start the SHAKEDOWN prototype's local server (if it is not already running) and print its address.
# Usage: game/play.sh [--open]   (--open also opens it in your default web browser)
HERE="$(cd "$(dirname "$0")" && pwd)"
PORT=8790
if [ "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/main.js")" != "200" ]; then
  nohup python3 -m http.server "$PORT" --directory "$HERE" >/dev/null 2>&1 &
  sleep 1
fi
echo "http://localhost:$PORT/"
[ "$1" = "--open" ] && open "http://localhost:$PORT/"
exit 0
