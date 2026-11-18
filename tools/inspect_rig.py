"""Import a rigged GLB, report its skeleton and animations, render frames of the motion.

Run:  Blender -b -P tools/inspect_rig.py -- <rigged.glb> <out_dir> <name> [camera_degrees]
"""
import math
import sys

import bpy
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
glb, out_dir, name = args[:3]
yaw = float(args[3]) if len(args) > 3 else 0.0

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)
scene = bpy.context.scene

armatures = [o for o in scene.objects if o.type == "ARMATURE"]
meshes = [o for o in scene.objects if o.type == "MESH"]
print(f"STATS armatures={len(armatures)} meshes={len(meshes)}")
for arm in armatures:
    print(f"STATS bones={len(arm.data.bones)} names={[b.name for b in arm.data.bones][:40]}")
for mesh in meshes:
    tris = sum(len(p.vertices) - 2 for p in mesh.data.polygons)
    print(f"STATS mesh={mesh.name} tris={tris} vertex_groups={len(mesh.vertex_groups)} "
          f"armature_mod={[m.type for m in mesh.modifiers]}")
for action in bpy.data.actions:
    print(f"STATS action={action.name} frames={tuple(round(f) for f in action.frame_range)}")
print(f"STATS images={[(i.name, tuple(i.size)) for i in bpy.data.images]}")

start, end = 1, 30
if bpy.data.actions:
    start, end = (int(round(f)) for f in bpy.data.actions[0].frame_range)
scene.frame_set(start)
bpy.context.view_layer.update()

# Drop helper meshes that are not skinned to the skeleton, then measure the posed body.
for extra in [m for m in meshes if not any(mod.type == "ARMATURE" for mod in m.modifiers)]:
    bpy.data.objects.remove(extra)
meshes = [o for o in scene.objects if o.type == "MESH"]
deps = bpy.context.evaluated_depsgraph_get()
corners = []
for o in meshes:
    posed = o.evaluated_get(deps)
    corners += [posed.matrix_world @ v.co for v in posed.data.vertices]
lo = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
hi = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
size, centre = hi - lo, (lo + hi) / 2
print(f"STATS size_m x={size.x:.2f} y={size.y:.2f} z={size.z:.2f}")

for engine in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue
scene.render.resolution_x, scene.render.resolution_y = 700, 1000
scene.view_settings.view_transform = "Standard"
world = bpy.data.worlds.new("World")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.42, 0.42, 0.45, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 1.6
scene.world = world

pivot = bpy.data.objects.new("Pivot", None)
pivot.location = centre
scene.collection.objects.link(pivot)
cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
cam.data.lens = 70
scene.collection.objects.link(cam)
scene.camera = cam
cam.parent = pivot
cam.location = (0, -size.z * 2.5, 0)
cam.rotation_euler = (math.radians(90), 0, 0)
sun = bpy.data.objects.new("Key", bpy.data.lights.new("Key", "SUN"))
sun.data.energy = 3.0
scene.collection.objects.link(sun)
sun.parent = pivot
sun.rotation_euler = (math.radians(70), 0, math.radians(-20))
pivot.rotation_euler = (0, 0, math.radians(yaw))

for view, turn in (("front", 0), ("side", -90), ("back", 180)):
    pivot.rotation_euler = (0, 0, math.radians(yaw + turn))
    for i in range(2):
        scene.frame_set(start + round((end - start) * (0.15 + 0.25 * i)))
        scene.render.filepath = f"{out_dir}/{name}-walk-{view}-{i + 1}.png"
        bpy.ops.render.render(write_still=True)

scene.frame_start, scene.frame_end = start, end
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=f"{out_dir}/{name}.blend")
print("STATS saved")
