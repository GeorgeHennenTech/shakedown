"""Fit separate clothing meshes onto a rigged base body and bind them to its skeleton.

Run:  Blender -b <body.blend> -P tools/fit_clothes.py -- <out_dir> <name> <config.json> [collarbone_keep 0-1]

<body.blend> is a file made by inspect_rig.py (rigged body, camera, light, pivot).
config.json maps a slot name to {"path": <game-weight .glb>, plus optional tuning}:
  kind      "skinned" (follows the body's weights) or "rigid" (follows one bone)
  bone      bone a rigid piece follows
  top/bottom  world heights in metres the piece should span, OR
  top_bone/bottom_bone + top_pad/bottom_pad  heights taken from bone positions
  width     for rigid pieces sized by width instead of height
  crown_fit for hats: crown width as a multiple of the skull width (sits on top of the head)
  wide/deep extra sideways / front-back stretch (1.0 = none)
  dx/dy/dz  nudge in metres after fitting
Outputs <name>.blend, <name>.glb and still renders of several outfit combinations.
"""
import json
import math
import sys

import bpy
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree

args = sys.argv[sys.argv.index("--") + 1:]
out_dir, name, config_path = args[:3]
config = json.load(open(config_path))

scene = bpy.context.scene
arm = next(o for o in scene.objects if o.type == "ARMATURE")
body = next(o for o in scene.objects if o.type == "MESH")
body.name = "Body"
arm.data.pose_position = "REST"
bpy.context.view_layer.update()

body_pts = [body.matrix_world @ v.co for v in body.data.vertices]
body_tris = [tuple(p.vertices) for p in body.data.polygons]
bvh = BVHTree.FromPolygons(body_pts, body_tris)


def bone_z(bone):
    return (arm.matrix_world @ arm.data.bones[bone].head_local).z


def body_slice(z0, z1, max_abs_x=9.0):
    pts = [p for p in body_pts if z0 <= p.z <= z1 and abs(p.x) <= max_abs_x]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return lo, hi


def bounds(obj):
    pts = [obj.matrix_world @ v.co for v in obj.data.vertices]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return lo, hi


def import_piece(path, slot):
    before = set(scene.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in scene.objects if o not in before]
    meshes = [o for o in new if o.type == "MESH"]
    bpy.ops.object.select_all(action="DESELECT")
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    obj.parent = None
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    for o in new:
        if o != obj and o.name in scene.objects:
            bpy.data.objects.remove(o)
    obj.name = slot
    return obj


body_lo, body_hi = body_slice(-9, 9)
print(f"STATS body lo={tuple(round(c, 3) for c in body_lo)} hi={tuple(round(c, 3) for c in body_hi)}")
for b in ("Hips", "Spine", "neck", "Head", "LeftArm", "LeftForeArm", "LeftUpLeg", "LeftLeg", "LeftFoot"):
    print(f"STATS bone {b} head={tuple(round(c, 3) for c in arm.matrix_world @ arm.data.bones[b].head_local)}")

pieces = {}
for slot, cfg in config.items():
    obj = import_piece(cfg["path"], slot)
    if cfg.get("rx"):
        obj.matrix_world = Matrix.Rotation(math.radians(cfg["rx"]), 4, "X") @ obj.matrix_world
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    lo, hi = bounds(obj)
    size = hi - lo
    top = cfg.get("top", bone_z(cfg["top_bone"]) + cfg.get("top_pad", 0) if "top_bone" in cfg else None)
    bottom = cfg.get("bottom", bone_z(cfg["bottom_bone"]) + cfg.get("bottom_pad", 0) if "bottom_bone" in cfg else None)
    if "crown_fit" in cfg:
        # Size a hat so its crown (upper half) is a little wider than the skull, and sit it on top.
        head_lo, head_hi = body_slice(bone_z("Head") + 0.09, 9)
        crown = [obj.matrix_world @ v.co for v in obj.data.vertices]
        crown = [p for p in crown if p.z > lo.z + size.z * 0.55]
        crown_w = max(p.x for p in crown) - min(p.x for p in crown)
        s = (head_hi.x - head_lo.x) * cfg["crown_fit"] / crown_w
        top = head_hi.z + cfg.get("top_gap", 0.02)
        print(f"STATS {slot}: head width={head_hi.x - head_lo.x:.3f} top={head_hi.z:.3f} crown={crown_w:.3f} scale={s:.3f}")
    elif "width" in cfg:
        s = cfg["width"] / size.x
        if top is None:
            top = bottom + size.z * s
    else:
        s = (top - bottom) / size.z
    centre_lo, centre_hi = body_slice(top - size.z * s, top, cfg.get("slice_x", 0.16))
    target = Vector(((centre_lo.x + centre_hi.x) / 2, (centre_lo.y + centre_hi.y) / 2, top - size.z * s / 2))
    scale = Matrix.Diagonal((s * cfg.get("wide", 1.0), s * cfg.get("deep", 1.0), s, 1.0))
    centre = (lo + hi) / 2
    obj.matrix_world = (
        Matrix.Translation(target + Vector((cfg.get("dx", 0), cfg.get("dy", 0), cfg.get("dz", 0))))
        @ scale @ Matrix.Translation(-centre)
    )
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    if cfg.get("kind", "skinned") == "skinned":
        # Push any cloth that sits inside (or too close to) the skin back outside it.
        gap = cfg.get("gap", 0.008)
        moved = 0
        for v in obj.data.vertices:
            hit, normal, _, dist = bvh.find_nearest(v.co)
            if hit is None:
                continue
            inside = (v.co - hit).dot(normal) < 0
            if inside:
                v.co = hit + normal * gap
                moved += 1
        for g in body.vertex_groups:
            obj.vertex_groups.new(name=g.name)
        mod = obj.modifiers.new("Weights", "DATA_TRANSFER")
        mod.object = body
        mod.use_vert_data = True
        mod.data_types_verts = {"VGROUP_WEIGHTS"}
        mod.vert_mapping = "POLYINTERP_NEAREST"
        mod.layers_vgroup_select_src = "ALL"
        mod.layers_vgroup_select_dst = "NAME"
        bpy.ops.object.modifier_apply(modifier=mod.name)
        print(f"STATS {slot}: skinned, pushed {moved}/{len(obj.data.vertices)} verts out of the skin")
    else:
        group = obj.vertex_groups.new(name=cfg["bone"])
        if "bone_low" in cfg:
            low = obj.vertex_groups.new(name=cfg["bone_low"])
            z_hi, z_lo = cfg["blend"]
            for v in obj.data.vertices:
                w = min(1.0, max(0.0, (v.co.z - z_lo) / (z_hi - z_lo)))
                group.add([v.index], w, "REPLACE")
                low.add([v.index], 1.0 - w, "REPLACE")
        else:
            group.add(range(len(obj.data.vertices)), 1.0, "REPLACE")
        print(f"STATS {slot}: rigid on {cfg['bone']}")

    if cfg.get("hide_body", cfg.get("kind", "skinned") == "skinned"):
        # Hide the skin that this piece covers, so it can never poke through.
        piece_bvh = BVHTree.FromPolygons([v.co.copy() for v in obj.data.vertices],
                                         [tuple(p.vertices) for p in obj.data.polygons])
        reach = cfg.get("cover", 0.07)
        covered = set()
        for v in body.data.vertices:
            origin = body.matrix_world @ v.co
            normal = (body.matrix_world.to_3x3() @ v.normal).normalized()
            if piece_bvh.ray_cast(origin + normal * 0.001, normal, reach)[0] is not None:
                covered.add(v.index)
        neighbours = {}
        for e in body.data.edges:
            a, b = e.vertices
            neighbours.setdefault(a, []).append(b)
            neighbours.setdefault(b, []).append(a)
        for _ in range(cfg.get("erode", 2)):
            covered = {i for i in covered if all(n in covered for n in neighbours.get(i, []))}
        hide = body.vertex_groups.new(name=f"under_{slot}")
        hide.add(list(covered), 1.0, "REPLACE")
        mask = body.modifiers.new(f"under_{slot}", "MASK")
        mask.vertex_group = hide.name
        mask.invert_vertex_group = True
        print(f"STATS {slot}: hides {len(covered)} body verts")
    obj.parent = arm
    obj.matrix_parent_inverse = arm.matrix_world.inverted()
    obj.modifiers.new("Armature", "ARMATURE").object = arm
    lo, hi = bounds(obj)
    tris = sum(len(p.vertices) - 2 for p in obj.data.polygons)
    print(f"STATS {slot}: tris={tris} lo={tuple(round(c, 3) for c in lo)} hi={tuple(round(c, 3) for c in hi)}")
    pieces[slot] = obj

arm.data.pose_position = "POSE"
start, end = scene.frame_start, scene.frame_end

# Square the shoulders: the walk clip drags the collarbones down, which makes the neck look
# long and the traps huge. Keep only a fraction of that motion and let the upper arms make
# up the difference, so the arms still swing exactly as before.
keep = float(args[3]) if len(args) > 3 else 1.0
if keep < 1.0:
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
            origin = arm.pose.bones[up].matrix.translation.copy()
            fixed = arm_matrix.copy()
            fixed.translation = origin
            arm.pose.bones[up].matrix = fixed
            bpy.context.view_layer.update()
            arm.pose.bones[up].keyframe_insert("rotation_quaternion", frame=f)
    print(f"STATS shoulders squared, keeping {keep:.0%} of collarbone motion")
pivot = bpy.data.objects["Pivot"]
scene.render.resolution_x, scene.render.resolution_y = 600, 900

slots = list(pieces)
outfits = {"bare": [], "full": slots}
if len(slots) >= 4:
    outfits["mix-a"] = slots[:2]
    outfits["mix-b"] = slots[1:]
for label, worn in outfits.items():
    for slot, obj in pieces.items():
        obj.hide_render = slot not in worn
        if f"under_{slot}" in body.modifiers:
            body.modifiers[f"under_{slot}"].show_render = slot in worn
    for view, yaw, frac in (("front", 0, 0.2), ("side", -70, 0.45), ("back", 180, 0.7)):
        if label not in ("full",) and view != "front":
            continue
        pivot.rotation_euler = (0, 0, math.radians(yaw))
        scene.frame_set(start + round((end - start) * frac))
        scene.render.filepath = f"{out_dir}/{name}-{label}-{view}.png"
        bpy.ops.render.render(write_still=True)

# Outfit changes keyed across the walk, for the video.
step = (end - start + 1) // 4
order = ["bare", "mix-a", "full", "mix-b"] if "mix-a" in outfits else ["bare", "full", "bare", "full"]
for i, label in enumerate(order):
    for slot, obj in pieces.items():
        obj.hide_render = slot not in outfits[label]
        obj.hide_viewport = obj.hide_render
        obj.keyframe_insert("hide_render", frame=start + i * step)
        obj.keyframe_insert("hide_viewport", frame=start + i * step)
        if f"under_{slot}" in body.modifiers:
            m = body.modifiers[f"under_{slot}"]
            m.show_render = slot in outfits[label]
            m.keyframe_insert("show_render", frame=start + i * step)
for obj in pieces.values():
    for fc in obj.animation_data.action.fcurves if hasattr(obj.animation_data.action, "fcurves") else []:
        for k in fc.keyframe_points:
            k.interpolation = "CONSTANT"
pivot.rotation_euler = (0, 0, math.radians(-30))

bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=f"{out_dir}/{name}.blend")
for obj in pieces.values():
    obj.hide_render = obj.hide_viewport = False
    obj.animation_data_clear()
for m in body.modifiers:
    if m.type == "MASK":
        m.show_render = m.show_viewport = False
bpy.ops.object.select_all(action="DESELECT")
for o in [arm, body, *pieces.values()]:
    o.hide_set(False)
    o.select_set(True)
bpy.ops.export_scene.gltf(filepath=f"{out_dir}/{name}.glb", export_format="GLB", use_selection=True,
                          export_image_format="JPEG", export_image_quality=90)
print("STATS saved")
