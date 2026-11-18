"""Export a fitted modular character for the browser game.

Run:  Blender -b <fitted.blend> -P tools/export_player.py -- <out_dir> <name> <collarbone_keep> [clip=rig.glb ...]

<fitted.blend> comes from fit_clothes.py. Writes:
  <name>.glb          skeleton, clothing pieces, the body cut into parts, and the clip already in the file
  <name>-<clip>.glb   skeleton + one extra clip each (taken from another rig of the same body)

The body is cut by what covers it. A part named "BodyU-tee-shorts" is skin that sits under both
the tee and the shorts: the game shows a part only while none of the pieces in its name are worn.
"""
import sys

import bmesh
import bpy
from mathutils import Matrix

args = sys.argv[sys.argv.index("--") + 1:]
out_dir, name, keep = args[0], args[1], float(args[2])
extra = dict(a.split("=", 1) for a in args[3:])

scene = bpy.context.scene
arm = next(o for o in scene.objects if o.type == "ARMATURE")
body = scene.objects["Body"]
pieces = [o for o in scene.objects if o.type == "MESH" and o != body]

# Clear the outfit-swap keyframes and masks the preview video used.
for o in pieces + [body]:
    o.animation_data_clear()
    o.hide_render = o.hide_viewport = False
    o.hide_set(False)
for m in [m for m in body.modifiers if m.type == "MASK"]:
    body.modifiers.remove(m)

# Cut the body into parts by which pieces cover each face.
under = {g.index: g.name[len("under_"):] for g in body.vertex_groups if g.name.startswith("under_")}
bpy.context.view_layer.objects.active = body
bpy.ops.object.select_all(action="DESELECT")
body.select_set(True)
bpy.ops.object.mode_set(mode="EDIT")
bm = bmesh.from_edit_mesh(body.data)
layer = bm.verts.layers.deform.verify()
cover = {}
for f in bm.faces:
    key = frozenset(under[i] for v in f.verts for i, w in v[layer].items() if i in under and w > 0)
    cover.setdefault(key, []).append(f.index)
keys = [k for k in cover if k]
bpy.ops.object.mode_set(mode="OBJECT")
parts = []
for key in keys:
    bpy.ops.object.select_all(action="DESELECT")
    body.select_set(True)
    bpy.context.view_layer.objects.active = body
    bpy.ops.object.mode_set(mode="EDIT")
    bm = bmesh.from_edit_mesh(body.data)
    layer = bm.verts.layers.deform.verify()
    for f in bm.faces:
        f.select = frozenset(under[i] for v in f.verts for i, w in v[layer].items() if i in under and w > 0) == key
    bmesh.update_edit_mesh(body.data)
    bpy.ops.mesh.separate(type="SELECTED")
    bpy.ops.object.mode_set(mode="OBJECT")
    part = next(o for o in bpy.context.selected_objects if o != body)
    part.name = "BodyU-" + "-".join(sorted(key))
    parts.append(part)
    print(f"STATS part {part.name} faces={len(part.data.polygons)}")
print(f"STATS part Body faces={len(body.data.polygons)}")


def square_shoulders(start, end):
    pairs = [("LeftShoulder", "LeftArm"), ("RightShoulder", "RightArm")]
    saved = {}
    for f in range(start, end + 1):
        scene.frame_set(f)
        for sh, up in pairs:
            saved[(f, sh)] = (arm.pose.bones[sh].rotation_quaternion.copy(), arm.pose.bones[up].matrix.copy())
    rest = Matrix.Identity(4).to_quaternion()
    for f in range(start, end + 1):
        scene.frame_set(f)
        for sh, up in pairs:
            quat, arm_matrix = saved[(f, sh)]
            arm.pose.bones[sh].rotation_quaternion = rest.slerp(quat, keep)
            arm.pose.bones[sh].keyframe_insert("rotation_quaternion", frame=f)
            bpy.context.view_layer.update()
            fixed = arm_matrix.copy()
            fixed.translation = arm.pose.bones[up].matrix.translation.copy()
            arm.pose.bones[up].matrix = fixed
            bpy.context.view_layer.update()
            arm.pose.bones[up].keyframe_insert("rotation_quaternion", frame=f)


def export(path, objects):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objects:
        o.select_set(True)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.export_scene.gltf(filepath=path, export_format="GLB", use_selection=True,
                              export_image_format="JPEG", export_image_quality=88,
                              export_animation_mode="ACTIVE_ACTIONS")


arm.animation_data.action.name = "Walk"
export(f"{out_dir}/{name}.glb", [arm, body, *parts, *pieces])
print("STATS exported main")

for clip, path in extra.items():
    before = set(bpy.data.actions)
    old_objects = set(scene.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    action = next(a for a in bpy.data.actions if a not in before)
    for o in [o for o in scene.objects if o not in old_objects]:
        bpy.data.objects.remove(o)
    action.name = clip
    arm.animation_data.action = action
    if hasattr(arm.animation_data, "action_slot") and action.slots:
        arm.animation_data.action_slot = action.slots[0]
    start, end = (int(round(f)) for f in action.frame_range)
    scene.frame_start, scene.frame_end = start, end
    if keep < 1.0:
        square_shoulders(start, end)
    export(f"{out_dir}/{name}-{clip.lower()}.glb", [arm])
    print(f"STATS exported {clip} frames={start}-{end}")
