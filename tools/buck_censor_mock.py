"""Buck: recolour his shorts to skin tone, then render a mock of the in-game censor.

Works on the .blend that inspect_rig.py saved (rigged model, camera on a "Pivot").
The censor here is a post-process mosaic placed from the Hips bone, to preview how
the in-engine effect will read. Also exports the recoloured rigged GLB.

Run:  Blender -b art/buck/buck-rigged.blend -P tools/buck_censor_mock.py -- <out_dir>
"""
import math
import sys

import bpy
import numpy as np
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

out_dir = sys.argv[sys.argv.index("--") + 1]
scene = bpy.context.scene
arm = next(o for o in scene.objects if o.type == "ARMATURE")
body = next(o for o in scene.objects if o.type == "MESH")
cam, pivot = scene.camera, bpy.data.objects["Pivot"]

# ---- 1. Find the base-colour texture -------------------------------------------------
image = None
for slot in body.material_slots:
    for node in slot.material.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED" and node.inputs["Base Color"].links:
            source = node.inputs["Base Color"].links[0].from_node
            if source.type == "TEX_IMAGE":
                image = source.image
W, H = image.size
px = np.empty(W * H * 4, dtype=np.float32)
image.pixels.foreach_get(px)
px = px.reshape(H, W, 4)

# ---- 2. Rasterise the UV triangles of the shorts region into a mask ------------------
mesh = body.data
mw = body.matrix_world
pos = np.array([(mw @ v.co)[:] for v in mesh.vertices])      # rest pose, metres
height = pos[:, 2].max() - pos[:, 2].min()
floor, mid_x = pos[:, 2].min(), pos[:, 0].mean()
uv = np.empty(len(mesh.loops) * 2, dtype=np.float32)
mesh.uv_layers.active.data.foreach_get("uv", uv)
uv = uv.reshape(-1, 2)


def region_mask(z_lo, z_hi, half_width):
    mask = np.zeros((H, W), dtype=bool)
    for poly in mesh.polygons:
        centre = pos[list(poly.vertices)].mean(axis=0)
        rel = (centre[2] - floor) / height
        if not (z_lo <= rel <= z_hi) or abs(centre[0] - mid_x) > half_width:
            continue
        (ax, ay), (bx, by), (cx, cy) = (uv[i] * (W, H) for i in list(poly.loop_indices)[:3])
        x0, x1 = int(max(0, min(ax, bx, cx) - 1)), int(min(W - 1, max(ax, bx, cx) + 1))
        y0, y1 = int(max(0, min(ay, by, cy) - 1)), int(min(H - 1, max(ay, by, cy) + 1))
        if x1 <= x0 or y1 <= y0:
            continue
        gx, gy = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
        den = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy)
        if abs(den) < 1e-9:
            continue
        l1 = ((by - cy) * (gx - cx) + (cx - bx) * (gy - cy)) / den
        l2 = ((cy - ay) * (gx - cx) + (ax - cx) * (gy - cy)) / den
        inside = (l1 >= -0.05) & (l2 >= -0.05) & (l1 + l2 <= 1.05)
        mask[y0:y1 + 1, x0:x1 + 1] |= inside
    return mask


shorts = region_mask(0.335, 0.60, 0.28)      # waistband down to the hem, hands excluded
belly = region_mask(0.63, 0.72, 0.14)        # bare skin to sample the tone from
for _ in range(3):                           # grow the mask a little to cover seams
    shorts = shorts | np.roll(shorts, 1, 0) | np.roll(shorts, -1, 0) | np.roll(shorts, 1, 1) | np.roll(shorts, -1, 1)

skin = np.median(px[belly][:, :3], axis=0)
lum = px[..., :3].mean(axis=2)
shade = np.clip(lum / max(float(np.median(lum[shorts])), 1e-4), 0.6, 1.25)
px[shorts, :3] = skin * (0.86 + 0.14 * shade[shorts])[:, None]
image.pixels.foreach_set(px.ravel())
image.update()
image.pack()
print(f"STATS recoloured {int(shorts.sum())} texels, skin tone {tuple(round(float(c), 3) for c in skin)}")

# ---- 3. Render frames, then lay a mosaic over the hips -------------------------------
settings = scene.render.image_settings
if hasattr(settings, "media_type"):
    settings.media_type = "IMAGE"
settings.file_format = "PNG"
scene.frame_step = 1
RW, RH = 700, 1000
scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = RW, RH, 100
BLOCK = 26


def censor(path):
    hips = arm.matrix_world @ arm.pose.bones["Hips"].head
    right = cam.matrix_world.to_3x3() @ Vector((1, 0, 0))
    up = Vector((0, 0, 1))
    corners = [hips + right * sx + up * sz for sx in (-0.27, 0.27) for sz in (-0.40, 0.10)]
    view = [world_to_camera_view(scene, cam, c) for c in corners]
    x0 = int(min(v.x for v in view) * RW) // BLOCK * BLOCK
    x1 = int(max(v.x for v in view) * RW) // BLOCK * BLOCK + BLOCK
    y0 = int(min(v.y for v in view) * RH) // BLOCK * BLOCK
    y1 = int(max(v.y for v in view) * RH) // BLOCK * BLOCK + BLOCK
    shot = bpy.data.images.load(path)
    buf = np.empty(RW * RH * 4, dtype=np.float32)
    shot.pixels.foreach_get(buf)
    buf = buf.reshape(RH, RW, 4)
    for y in range(max(0, y0), min(RH, y1), BLOCK):
        for x in range(max(0, x0), min(RW, x1), BLOCK):
            buf[y:y + BLOCK, x:x + BLOCK, :3] = buf[y:y + BLOCK, x:x + BLOCK, :3].mean(axis=(0, 1))
    shot.pixels.foreach_set(buf.ravel())
    shot.filepath_raw = path
    shot.file_format = "PNG"
    shot.save()
    bpy.data.images.remove(shot)


start, end = (int(round(f)) for f in bpy.data.actions[0].frame_range)
shots = (("front", 0, 0.3), ("three-quarter", -35, 0.7), ("back", 180, 0.3))
for label, yaw, when in shots:
    pivot.rotation_euler = (0, 0, math.radians(yaw))
    scene.frame_set(start + round((end - start) * when))
    raw = f"{out_dir}/buck-skin-{label}.png"
    scene.render.filepath = raw
    bpy.ops.render.render(write_still=True)
    done = f"{out_dir}/buck-censored-{label}.png"
    import shutil
    shutil.copyfile(raw, done)
    censor(done)
    print(f"STATS rendered {label}")

# ---- 4. Save the recoloured rigged model ---------------------------------------------
for o in scene.objects:
    o.select_set(o in (arm, body))
bpy.ops.export_scene.gltf(filepath=f"{out_dir}/buck-rigged-censor-ready.glb", export_format="GLB",
                          export_image_format="JPEG", export_image_quality=90,
                          use_selection=True, export_animations=True)
bpy.ops.wm.save_as_mainfile(filepath=f"{out_dir}/buck-rigged-censor-ready.blend")
print("STATS saved")
