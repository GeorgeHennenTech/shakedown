// Item pictures for the bag, the stash and the hotbar. Hand-drawn as small SVGs so they stay sharp at any size.
const svg = (body) => `<svg viewBox="0 0 48 48" aria-hidden="true"><g stroke="#17111f" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;

export const ICONS = {
  serum: svg(`<path d="M19 6h10v4H19z" fill="#8a5a2b"/><path d="M20 10h8v10l8 16a4 4 0 0 1-4 6H16a4 4 0 0 1-4-6l8-16z" fill="#d8f3dc"/><path d="M16 30h16l4 6a4 4 0 0 1-4 6H16a4 4 0 0 1-4-6z" fill="#52d273"/><path d="M24 33v-5m0 0c0-3 2-4 4-4m-4 4c0-3-2-4-4-4" fill="none"/>`),
  // things you carry
  cheese: svg(`<path d="M6 30 24 10l18 20z" fill="#e8a33d"/><path d="M6 30h36v6H6z" fill="#ffd23f"/><path d="M6 36h36l-2 5H8z" fill="#c9822b"/>
    <path d="M14 36c0 4 3 4 3 0M29 36c0 5 4 5 4 0" fill="#ffd23f"/><path d="M17 24l4-4M25 26l5-6" stroke="#8a5a1c" fill="none"/>`),
  supplies: svg(`<path d="M5 24c0-9 6-13 14-13s14 4 14 13v12H5z" fill="#e2b877"/><path d="M12 18l3 4M19 16l2 5M26 18l1 4" stroke="#a9773a" fill="none"/>
    <path d="M24 40l19-9v8l-19 5z" fill="#ffc93c"/><path d="M24 40l19-9-12-3z" fill="#ffe08a"/><circle cx="35" cy="37" r="1.6" fill="#e8a33d" stroke="none"/>`),
  bottles: svg(`<path d="M20 4h8v6l5 6v26a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V16l5-6z" fill="#bfe6ff"/><path d="M20 4h8v5h-8z" fill="#3aa0ff"/>
    <path d="M15 24h18v10H15z" fill="#3aa0ff"/><path d="M19 29c2-2 4 2 6 0s3 1 4 0" stroke="#fff" fill="none"/>`),
  wipes: svg(`<rect x="5" y="14" width="38" height="24" rx="5" fill="#9fe3db"/><rect x="14" y="19" width="20" height="9" rx="4" fill="#fff"/>
    <path d="M18 19c2-7 10-7 12 0" fill="#fff"/><path d="M12 33h24" stroke="#2ec4b6" fill="none"/>`),
  salvage: svg(`<circle cx="24" cy="24" r="17" fill="#aeb4ba"/><circle cx="24" cy="24" r="8" fill="#fff3d6"/><path d="M39 30l5 9-8-2z" fill="#aeb4ba"/>
    <path d="M10 18c3-6 9-9 15-9" stroke="#fff" fill="none"/>`),
  fabric: svg(`<path d="M6 30h36v10H6z" fill="#8f6aff"/><path d="M8 20h32v10H8z" fill="#ff5d8f"/><path d="M10 10h28v10H10z" fill="#2ec4b6"/>
    <path d="M14 15h6M26 25h8M12 35h5M22 35h5" stroke="#fff" fill="none"/>`),
  lights: svg(`<path d="M4 12c8 10 14 10 20 2s12-6 20 4" fill="none"/><path d="M9 19l-2 8a4 4 0 0 0 7 1z" fill="#ff5d8f"/><path d="M22 18l-1 9a4 4 0 0 0 7-1z" fill="#ffc93c"/>
    <path d="M36 15l1 9a4 4 0 0 0 7-2z" fill="#2ec4b6"/><path d="M16 38l4 4M24 37v6M32 38l-4 4" stroke="#8a8f96" fill="none"/>`),
  seeds: svg(`<path d="M10 14h28l-3 28H13z" fill="#e2b877"/><path d="M10 14l4-8h20l4 8z" fill="#c9a05c"/><path d="M24 36V24" fill="none"/>
    <path d="M24 28c-6 0-8-4-8-7 5 0 8 3 8 7zM24 26c5 0 8-3 8-7-5 0-8 3-8 7z" fill="#5cb85c"/>`),
  herbs: svg(`<path d="M24 44V20" fill="none"/><path d="M24 22C12 22 8 14 8 6c10 0 16 6 16 16zM24 26c11 0 16-7 16-16-10 0-16 6-16 16zM24 34c-8 0-12-4-12-9 7 0 12 3 12 9z" fill="#5cb85c"/>
    <path d="M17 40h14" stroke="#c9822b" fill="none"/>`),
  kandi: svg(`<circle cx="24" cy="24" r="15" fill="none" stroke-width="3"/><circle cx="24" cy="9" r="5" fill="#ff5d8f"/><circle cx="37" cy="17" r="5" fill="#ffc93c"/><circle cx="37" cy="31" r="5" fill="#2ec4b6"/>
    <circle cx="24" cy="39" r="5" fill="#8f6aff"/><circle cx="11" cy="31" r="5" fill="#ff7b54"/><circle cx="11" cy="17" r="5" fill="#7cf29a"/>`),
  electro: svg(`<path d="M9 8h30l-2 34H11z" fill="#ffc93c"/><path d="M9 8h30l-1 7H10z" fill="#ff7b54"/><path d="M27 18l-9 11h6l-3 9 9-12h-6z" fill="#fff"/>`),
  trailmix: svg(`<path d="M10 12h28l-3 30H13z" fill="#c9822b"/><path d="M10 12l3-6h22l3 6z" fill="#e8a33d"/><circle cx="19" cy="24" r="3" fill="#6b3f1d"/><circle cx="28" cy="22" r="3" fill="#ffc93c"/>
    <circle cx="24" cy="31" r="3" fill="#d7263d"/><circle cx="31" cy="33" r="2.5" fill="#6b3f1d"/><circle cx="17" cy="34" r="2.5" fill="#ffc93c"/>`),
  cup: svg(`<path d="M12 10h24l-3 32H15z" fill="#bfe6ff"/><path d="M13 18h22l-2 24H15z" fill="#3aa0ff"/><path d="M30 4l-4 14" stroke="#d7263d" fill="none"/><path d="M18 26h4M26 32h4" stroke="#fff" fill="none"/>`),
  ice: svg(`<rect x="6" y="18" width="36" height="22" rx="3" fill="#2f6fb0"/><rect x="5" y="12" width="38" height="8" rx="3" fill="#f2efe6"/><path d="M17 12c0-6 14-6 14 0" fill="none"/>
    <path d="M24 24v10M19 26l10 6M29 26l-10 6" stroke="#fff" fill="none"/>`),
  usb: svg(`<rect x="16" y="18" width="16" height="26" rx="3" fill="#8f6aff"/><rect x="19" y="6" width="10" height="12" fill="#d8dde2"/><path d="M22 10v3M26 10v3" fill="none"/><circle cx="24" cy="32" r="3" fill="#ffc93c"/>`),
  poncho: svg(`<path d="M24 6c5 0 7 4 7 8l12 22-6 6H11l-6-6 12-22c0-4 2-8 7-8z" fill="#ffc93c"/><path d="M18 15c2 4 10 4 12 0" fill="none"/><path d="M24 20v22" stroke="#c99a1c" fill="none"/>
    <path d="M38 6l-2 5M43 12l-3 4M8 8l2 5" stroke="#3aa0ff" fill="none"/>`),
  balloons: svg(`<path d="M24 4c9 0 14 7 14 15s-7 15-14 15-14-7-14-15S15 4 24 4z" fill="#ff5d8f"/><path d="M21 34h6l-1 4h-4z" fill="#ff5d8f"/><path d="M24 38c-3 3 3 4 0 8" fill="none"/>
    <path d="M17 13c2-4 6-5 9-4" stroke="#fff" fill="none"/>`),
  b12: svg(`<rect x="13" y="14" width="22" height="30" rx="4" fill="#fff3d6"/><rect x="16" y="6" width="16" height="9" rx="2" fill="#d7263d"/><rect x="13" y="24" width="22" height="11" fill="#d7263d"/>
    <path d="M19 28v4M19 28h3M24 28v4M27 28h3v2h-3v2h3" stroke="#fff" fill="none" stroke-width="1.6"/>`),
  tomato: svg(`<circle cx="24" cy="27" r="16" fill="#e0392b"/><path d="M24 13c-4-5-9-3-10 0 4 0 6 1 10 0zM24 13c4-5 9-3 10 0-4 0-6 1-10 0zM24 6v8" fill="#3f9d4a"/><path d="M15 22c2-4 6-5 9-4" stroke="#fff" fill="none"/>`),
  pepper: svg(`<path d="M20 14c-10 4-12 18-6 26 4 5 10 2 12-4 3-8 8-12 6-20-1-5-8-5-12-2z" fill="#3f9d4a"/><path d="M24 12c0-4 2-7 6-8" fill="none"/><path d="M17 22c0-3 2-5 4-6" stroke="#fff" fill="none"/>`),
  sage: svg(`<path d="M24 44V18" fill="none"/><path d="M24 20c-9-2-11-9-9-14 6 1 10 6 9 14zM24 28c9-2 12-9 10-14-7 1-11 6-10 14zM24 36c-8-1-11-7-10-11 6 0 10 4 10 11z" fill="#9fb8a0"/><path d="M18 42h12" stroke="#8a5a2b" fill="none"/>`),
  can: svg(`<path d="M12 18h20v22H12z" fill="#9aa0a6"/><path d="M32 22l12-8 2 3-12 12z" fill="#9aa0a6"/><path d="M12 22C4 22 4 34 12 34" fill="none"/><path d="M41 12l5-4M44 15l4-2M43 9l2-5" stroke="#3aa0ff" fill="none"/>`),
  compost: svg(`<path d="M8 16h32l-4 28H12z" fill="#8a5a2b"/><path d="M6 12h36v5H6z" fill="#6b4a2b"/><path d="M16 22v16M24 22v16M32 22v16" stroke="#6b4a2b" fill="none"/><path d="M20 10c0-5 8-5 8 0" fill="#5cb85c"/>`),
  // things you made
  sling: svg(`<path d="M10 6c6 10 22 10 28 0" fill="none"/><path d="M9 20h22v20a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4z" fill="#3f7d4e"/><path d="M9 20h22v7H9z" fill="#2f5f3b"/>
    <path d="M31 24h9v14a4 4 0 0 1-4 4h-5z" fill="#1c1c1c"/><path d="M33 16h6l-1 12h-4z" fill="#d7263d"/>`),
  tray: svg(`<rect x="4" y="22" width="40" height="12" rx="4" fill="#f2efe6"/><path d="M4 28h40" stroke="#2f6fb0" fill="none"/>
    <path d="M12 22l8-10 8 10z" fill="#e8a33d"/><path d="M26 22l6-8 6 8z" fill="#e8a33d"/><path d="M18 34v8M30 34v8" fill="none"/>`),
  vest: svg(`<path d="M14 6l-8 8v28h14V16zM34 6l8 8v28H28V16z" fill="#ff7b54"/><path d="M14 6l6 10M34 6l-6 10" fill="none"/>
    <path d="M6 22h14M6 30h14M28 22h14M28 30h14" stroke="#b9472a" fill="none"/>`),
  shade: svg(`<path d="M4 16l20-8 20 8-20 8z" fill="#3d7bd9"/><path d="M4 16v24M44 16v24M24 24v20" fill="none"/><path d="M4 16l20 8 20-8" fill="none"/>`),
  totem: svg(`<path d="M24 14v30" fill="none"/><path d="M24 2l8 8-8 8-8-8z" fill="#fff3a0"/><circle cx="19" cy="24" r="3.5" fill="#ff5d8f"/><circle cx="29" cy="30" r="3.5" fill="#2ec4b6"/>
    <circle cx="19" cy="36" r="3.5" fill="#8f6aff"/>`),
  hoodie: svg(`<path d="M16 6c0 8 16 8 16 0l12 8-5 9-5-3v22H14V20l-5 3-5-9z" fill="#5b3fa0"/><path d="M16 6c2 5 14 5 16 0" fill="#3d2a70"/>
    <path d="M18 30h12v8H18z" fill="#ffc93c"/><path d="M22 14v8M26 14v8" stroke="#fff" fill="none"/>`),
};
