import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.2Y155APn.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BnP7kZWx.js","_app/immutable/chunks/Bx5eiTM9.js","_app/immutable/chunks/Bkh49w_q.js","_app/immutable/chunks/WTqygo7-.js","_app/immutable/chunks/BsD17wSl.js","_app/immutable/chunks/DQcPFxbt.js","_app/immutable/chunks/BUK7UvFM.js"];
export const stylesheets = ["_app/immutable/assets/2.KxXJfvyW.css"];
export const fonts = [];
