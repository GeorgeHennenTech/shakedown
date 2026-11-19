#!/bin/bash
# Build SHAKEDOWN.app: a double-clickable Mac app that carries its own copy of the game.
# Usage: tools/build_app.sh <icon-1024.png> [output folder, default ~/Desktop]
# Re-run it after changing the game to refresh the app's copy.
set -e
HERE="$(cd "$(dirname "$0")/.." && pwd)"
ICON="$1"; OUT="${2:-$HOME/Desktop}"
APP="$OUT/SHAKEDOWN.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

# the game itself (without backups and test pages)
rsync -a --exclude 'main.blockout.js' --exclude 'zoo.html' --exclude 'refs' --exclude 'play.sh' --exclude 'dev' "$HERE/game/" "$APP/Contents/Resources/game/"

# the icon, in every size macOS asks for
SET="$(mktemp -d)/AppIcon.iconset"; mkdir -p "$SET"
for s in 16 32 128 256 512; do
  sips -z $s $s "$ICON" --out "$SET/icon_${s}x${s}.png" >/dev/null
  sips -z $((s*2)) $((s*2)) "$ICON" --out "$SET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$SET" -o "$APP/Contents/Resources/AppIcon.icns"

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>CFBundleName</key><string>SHAKEDOWN</string>
  <key>CFBundleDisplayName</key><string>SHAKEDOWN</string>
  <key>CFBundleIdentifier</key><string>local.shakedown.prototype</string>
  <key>CFBundleVersion</key><string>0.1</string>
  <key>CFBundleShortVersionString</key><string>0.1</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleExecutable</key><string>SHAKEDOWN</string>
  <key>CFBundleIconFile</key><string>AppIcon</string>
  <key>LSUIElement</key><true/>
</dict></plist>
PLIST

cat > "$APP/Contents/MacOS/SHAKEDOWN" <<'LAUNCH'
#!/bin/bash
# Serve the game bundled inside this app on its own port, then show it in an app-style window.
GAME="$(cd "$(dirname "$0")/../Resources/game" && pwd)"
PORT=8777
URL="http://localhost:$PORT/"
# Reuse the server only if it is this build's own. An older one (or a plain http.server from an earlier build, which let
# the browser keep a stale page) is stopped and replaced, so the window always shows the game that is in this app.
if [ "$(curl -s -m 1 "${URL}build.txt" 2>/dev/null)" != "$(cat "$GAME/build.txt")" ] || ! curl -sI -m 1 "$URL" | grep -qi 'cache-control: no-store'; then
  for pid in $(lsof -ti "tcp:$PORT" -sTCP:LISTEN 2>/dev/null); do
    if ps -o command= -p "$pid" | grep -qE 'http\.server|serve\.py'; then kill "$pid" 2>/dev/null; fi
  done
  sleep 0.3
  nohup /usr/bin/python3 "$GAME/../serve.py" "$PORT" "$GAME" >/dev/null 2>&1 &
  for i in $(seq 1 40); do curl -s -m 1 -o /dev/null "${URL}main.js" && break; sleep 0.3; done
fi
if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args --app="$URL" --window-size=1400,900
else
  open "$URL"
fi
LAUNCH
chmod +x "$APP/Contents/MacOS/SHAKEDOWN"

# a stamp for this build, and a server that tells the browser never to keep an old copy of any file
echo "$(grep -o 'main.js?v=[0-9]*' "$HERE/game/index.html" | cut -d= -f2) $(date '+%Y-%m-%d %H:%M:%S')" > "$APP/Contents/Resources/game/build.txt"
cat > "$APP/Contents/Resources/serve.py" <<'SERVE'
import functools, http.server, sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def log_message(self, *args):
        pass

http.server.ThreadingHTTPServer(('', int(sys.argv[1])), functools.partial(Handler, directory=sys.argv[2])).serve_forever()
SERVE

# If an earlier build's server is still running, swap it for this one now, so the next launch (or a reload) is this build.
if lsof -ti tcp:8777 -sTCP:LISTEN >/dev/null 2>&1; then
  for pid in $(lsof -ti tcp:8777 -sTCP:LISTEN); do
    if ps -o command= -p "$pid" | grep -qE 'http\.server|serve\.py'; then kill "$pid" 2>/dev/null; fi
  done
  sleep 0.3
  nohup /usr/bin/python3 "$APP/Contents/Resources/serve.py" 8777 "$APP/Contents/Resources/game" >/dev/null 2>&1 &
fi
touch "$APP"
echo "BUILT $APP ($(du -sh "$APP" | cut -f1))"
