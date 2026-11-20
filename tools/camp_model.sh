#!/bin/bash
# Fetch one camp model made by Higgsfield and slim it for the game.
#   bash tools/camp_model.sh <name> <url-of-the-high-detail-glb>
# Keeps the full-detail original in art/camp/models/ and writes game/assets/camp/<name>.glb (30,000 triangles, 2048 px texture, turned to face forward).
set -e
cd "$(dirname "$0")/.."
name="$1"; url="$2"
mkdir -p art/camp/models game/assets/camp
curl -s -o "art/camp/models/$name-high.glb" "$url"
/Applications/Blender.app/Contents/MacOS/Blender -b -P tools/make_game_mesh.py -- "art/camp/models/$name-high.glb" "game/assets/camp/$name.glb" 30000 2048 -90 2>&1 | grep STATS || echo "no STATS line for $name"
ls -la "game/assets/camp/$name.glb" | awk '{print $5, $9}'
