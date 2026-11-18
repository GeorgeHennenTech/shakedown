"""Slim a high-detail GLB down to a game-weight mesh, keeping its UVs and textures.

Run:  Blender -b -P tools/make_game_mesh.py -- <in.glb> <out.glb> <target_tris> <texture_px> [turn_degrees]

turn_degrees rotates the model about the vertical axis so it faces -Y, the front that
rigging services and game engines expect. Tripo models face +X, so they need -90.
"""
import math
import sys

import bpy
from mathutils import Matrix

args = sys.argv[sys.argv.index("--") + 1:]
src, dst, target, tex = args[0], args[1], int(args[2]), int(args[3])
turn = float(args[4]) if len(args) > 4 else 0.0

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
bpy.ops.object.select_all(action="DESELECT")
for o in meshes:
    o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1:
    bpy.ops.object.join()
obj = bpy.context.view_layer.objects.active

before = sum(len(p.vertices) - 2 for p in obj.data.polygons)
mod = obj.modifiers.new("Decimate", "DECIMATE")
mod.ratio = min(1.0, target / before)
mod.use_collapse_triangulate = True
bpy.ops.object.modifier_apply(modifier=mod.name)
bpy.ops.object.shade_smooth()
after = sum(len(p.vertices) - 2 for p in obj.data.polygons)

# Turn the model to face -Y (Blender's front), then apply transforms.
obj.matrix_world = Matrix.Rotation(math.radians(turn), 4, "Z") @ obj.matrix_world
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

for image in bpy.data.images:
    if image.size[0] > tex:
        image.scale(tex, tex)
        if image.packed_file:
            image.pack()

bpy.ops.export_scene.gltf(
    filepath=dst,
    export_format="GLB",
    export_image_format="JPEG",
    export_image_quality=90,
    export_apply=True,
)
print(f"STATS tris {before} -> {after}")
