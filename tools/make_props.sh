#!/bin/bash
# Download finished prop models and slim each to game weight.
# Usage: tools/make_props.sh <out_dir> name=url=tris=texture_px ...
B=/Applications/Blender.app/Contents/MacOS/Blender
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$1"; shift
mkdir -p "$OUT"
for spec in "$@"; do
  IFS='=' read -r name url tris tex <<< "$spec"
  curl -s -o "$OUT/$name-high.glb" "$url"
  "$B" -b -P "$HERE/make_game_mesh.py" -- "$OUT/$name-high.glb" "$OUT/$name.glb" "$tris" "$tex" -90 2>&1 | grep -E "STATS|Error" | sed "s/^/$name: /"
  rm -f "$OUT/$name-high.glb"
done
echo "PROPS DONE"
