// The talking head beside a line of dialogue. It films the real character in the world with a second
// camera, so the face you see is the one standing in front of you, and it moves the character's head
// while they speak.
import * as THREE from 'three';

const SIZE = 160;

export function createPortrait({ renderer, scene, canvas }) {
  const cam = new THREE.PerspectiveCamera(24, 1, 0.1, 3);
  const target = new THREE.WebGLRenderTarget(SIZE, SIZE);
  const raw = new Uint8Array(SIZE * SIZE * 4);
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(SIZE, SIZE);
  // the render target holds linear light: brighten it for the screen with a lookup table
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) lut[i] = 255 * Math.min(1, (i / 255) * 1.15) ** (1 / 2.2);
  const backdrop = new THREE.Color(0x7c5cc4), head = new THREE.Vector3(), fwd = new THREE.Vector3(), clear = new THREE.Color();
  let who = null, bone = null, wrote = null, rest = null, t = 0, frame = 0;

  const headBone = (ch) => ch.bones.Head || ch.bones.head || Object.values(ch.bones).find((b) => /head/i.test(b.name)) || null;

  return {
    // Point the portrait at a character, or pass null to put it away.
    set(ch) {
      if (ch === who) return;
      if (bone && rest) bone.quaternion.copy(rest);
      who = ch; bone = ch ? headBone(ch) : null; wrote = null; rest = bone ? bone.quaternion.clone() : null; t = 0;
    },
    // Call after the animation mixers have run. talking = the line is still being typed out.
    update(dt, talking) {
      if (!bone) return;
      t += dt;
      // If no animation is driving the head, undo last frame's nod before adding this frame's.
      if (wrote && bone.quaternion.equals(wrote)) bone.quaternion.copy(rest); else rest.copy(bone.quaternion);
      const amp = talking ? 1 : 0.35;
      bone.rotation.x += (Math.sin(t * 9.5) * 0.045 + Math.sin(t * 2.1) * 0.05) * amp;
      bone.rotation.y += Math.sin(t * 1.6) * 0.1 * amp;
      bone.rotation.z += Math.sin(t * 2.7) * 0.05 * amp;
      wrote = bone.quaternion.clone();
    },
    render() {
      if (!who || frame++ % 2) return; // every other frame is plenty
      if (bone) { bone.updateWorldMatrix(true, false); bone.getWorldPosition(head); } else { who.root.getWorldPosition(head); head.y += 1.6; }
      // which way the face points: the rig has a "headfront" bone just in front of the head
      const front = who.bones.headfront;
      if (front) { front.getWorldPosition(fwd).sub(head); fwd.y = 0; }
      if (!front || fwd.lengthSq() < 1e-6) who.root.getWorldDirection(fwd);
      fwd.normalize();
      fwd.applyAxisAngle(THREE.Object3D.DEFAULT_UP, 0.4); // three-quarter view
      cam.position.copy(head).addScaledVector(fwd, 1.25); cam.position.y += 0.1;
      cam.lookAt(head.x, head.y + 0.07, head.z);
      const bg = scene.background, fog = scene.fog, auto = renderer.shadowMap.autoUpdate, alpha = renderer.getClearAlpha();
      renderer.getClearColor(clear);
      scene.background = null; scene.fog = null; renderer.shadowMap.autoUpdate = false;
      renderer.setClearColor(backdrop, 1);
      renderer.setRenderTarget(target);
      renderer.clear();
      renderer.render(scene, cam);
      renderer.readRenderTargetPixels(target, 0, 0, SIZE, SIZE, raw);
      renderer.setRenderTarget(null);
      renderer.setClearColor(clear, alpha);
      scene.background = bg; scene.fog = fog; renderer.shadowMap.autoUpdate = auto;
      const out = image.data;
      for (let y = 0; y < SIZE; y++) {
        const src = (SIZE - 1 - y) * SIZE * 4, dst = y * SIZE * 4; // the target is upside down
        for (let x = 0; x < SIZE * 4; x += 4) {
          out[dst + x] = lut[raw[src + x]]; out[dst + x + 1] = lut[raw[src + x + 1]]; out[dst + x + 2] = lut[raw[src + x + 2]]; out[dst + x + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    },
  };
}
