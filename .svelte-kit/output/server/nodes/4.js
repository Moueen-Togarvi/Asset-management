

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/reports/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.DgCvyvGn.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BfTCcR_O.js","_app/immutable/chunks/Bx5eiTM9.js"];
export const stylesheets = ["_app/immutable/assets/4.DJuDddgL.css"];
export const fonts = [];
