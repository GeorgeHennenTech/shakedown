"""Import a GLB into Blender, report its stats, render a turnaround, save a .blend.

Run:  Blender -b -P tools/inspect_model.py -- <model.glb> <out_dir> <name> [front_degrees]
"""
import math
import sys

import bpy
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
glb, out_dir, name = args[:3]
# Degrees to turn the camera so "front" really faces the model's front.
front = float(args[3]) if len(args) > 3 else 0.0

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
corners = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
lo = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
hi = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
size, centre = hi - lo, (lo + hi) / 2

verts = sum(len(o.data.vertices) for o in meshes)
tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in meshes)
print(f"STATS objects={len(meshes)} verts={verts} tris={tris}")
print(f"STATS size_m x={size.x:.2f} y={size.y:.2f} z={size.z:.2f}")
print(f"STATS materials={[m.name for m in bpy.data.materials]}")
print(f"STATS images={[(i.name, tuple(i.size)) for i in bpy.data.images]}")
print(f"STATS armatures={len([o for o in bpy.context.scene.objects if o.type == 'ARMATURE'])}")

scene = bpy.context.scene
for engine in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue
scene.render.resolution_x, scene.render.resolution_y = 800, 1100
scene.render.film_transparent = False
scene.view_settings.view_transform = "Standard"

world = bpy.data.worlds.new("World")
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.42, 0.42, 0.45, 1)
bg.inputs[1].default_value = 1.6
scene.world = world

sun = bpy.data.objects.new("Key", bpy.data.lights.new("Key", "SUN"))
sun.data.energy = 3.0
scene.collection.objects.link(sun)

cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
cam.data.lens = 70
scene.collection.objects.link(cam)
scene.camera = cam
pivot = bpy.data.objects.new("Pivot", None)
pivot.location = centre
scene.collection.objects.link(pivot)
cam.parent = pivot
distance = max(size.z * 1.05, max(size.x, size.y) * 1.5) / (2 * math.tan(cam.data.angle_y / 2)) * 0.66
cam.location = (0, -distance, 0)
cam.rotation_euler = (math.radians(90), 0, 0)
# Key light rides with the camera so every view is lit from the front.
sun.parent = pivot
sun.rotation_euler = (math.radians(70), 0, math.radians(-20))

for label, angle in (("front", 0), ("three-quarter", -40), ("side", -90), ("back", 180)):
    pivot.rotation_euler = (0, 0, math.radians(front + angle))
    scene.render.filepath = f"{out_dir}/{name}-{label}.png"
    bpy.ops.render.render(write_still=True)

pivot.rotation_euler = (0, 0, math.radians(front - 40))
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=f"{out_dir}/{name}.blend")
print("STATS saved")
