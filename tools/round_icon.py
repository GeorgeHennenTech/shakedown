"""Turn a square picture into a macOS-style app icon: 1024 px, rounded corners, small margin.

Run:  Blender -b -P tools/round_icon.py -- <in.png> <out.png>
"""
import sys

import bpy
import numpy as np

src, dst = sys.argv[sys.argv.index("--") + 1:][:2]
img = bpy.data.images.load(src)
img.scale(1024, 1024)
art = np.array(img.pixels[:], dtype=np.float32).reshape(1024, 1024, 4)

# Apple's icon grid: the artwork sits in an 824 px rounded square inside the 1024 px canvas.
size, margin, radius = 1024, 100, 185
inner = size - 2 * margin
bpy.data.images.remove(img)
small = bpy.data.images.load(src)
small.scale(inner, inner)
tile = np.array(small.pixels[:], dtype=np.float32).reshape(inner, inner, 4)

out = np.zeros((size, size, 4), dtype=np.float32)
out[margin:margin + inner, margin:margin + inner] = tile
y, x = np.mgrid[0:size, 0:size].astype(np.float32)
# distance outside a rounded rectangle, for a soft anti-aliased edge
dx = np.maximum(np.abs(x - size / 2 + 0.5) - (inner / 2 - radius), 0)
dy = np.maximum(np.abs(y - size / 2 + 0.5) - (inner / 2 - radius), 0)
alpha = np.clip(radius - np.sqrt(dx * dx + dy * dy) + 0.5, 0, 1)
out[..., 3] = alpha
out[..., :3] *= alpha[..., None] > 0

icon = bpy.data.images.new("icon", size, size, alpha=True)
icon.pixels = out.ravel()
icon.filepath_raw = dst
icon.file_format = "PNG"
icon.save()
print("STATS icon saved")
