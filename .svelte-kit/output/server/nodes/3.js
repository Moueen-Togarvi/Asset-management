import * as server from '../entries/pages/dispatch/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dispatch/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dispatch/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.CvDNtzOZ.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Bx5eiTM9.js","_app/immutable/chunks/BnP7kZWx.js","_app/immutable/chunks/Bkh49w_q.js","_app/immutable/chunks/WTqygo7-.js","_app/immutable/chunks/BsD17wSl.js","_app/immutable/chunks/DQcPFxbt.js"];
export const stylesheets = ["_app/immutable/assets/3.81b7FX6u.css"];
export const fonts = [];
