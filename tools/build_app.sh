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
if ! curl -s "${URL}main.js" 2>/dev/null | head -1 | grep -q SHAKEDOWN; then
  nohup /usr/bin/python3 -m http.server "$PORT" --directory "$GAME" >/dev/null 2>&1 &
  for i in $(seq 1 40); do curl -s -m 1 -o /dev/null "${URL}main.js" && break; sleep 0.3; done
fi
if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args --app="$URL" --window-size=1400,900
else
  open "$URL"
fi
LAUNCH
chmod +x "$APP/Contents/MacOS/SHAKEDOWN"
touch "$APP"
echo "BUILT $APP ($(du -sh "$APP" | cut -f1))"
