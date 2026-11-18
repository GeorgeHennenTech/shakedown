"""Render a rigged character's animation to an MP4 from a .blend made by inspect_rig.py.

Run:  Blender -b <file.blend> -P tools/render_walk.py -- <out.mp4> [camera_degrees]
"""
import math
import sys

import bpy

args = sys.argv[sys.argv.index("--") + 1:]
out = args[0]
yaw = float(args[1]) if len(args) > 1 else -30.0

scene = bpy.context.scene
bpy.data.objects["Pivot"].rotation_euler = (0, 0, math.radians(yaw))
scene.render.resolution_x, scene.render.resolution_y = 540, 760
scene.frame_step = 2
scene.render.fps = 15
settings = scene.render.image_settings
if hasattr(settings, "media_type"):
    settings.media_type = "VIDEO"
settings.file_format = "FFMPEG"
scene.render.ffmpeg.format = "MPEG4"
scene.render.ffmpeg.codec = "H264"
scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
scene.render.filepath = out
bpy.ops.render.render(animation=True)
print("STATS video done")
