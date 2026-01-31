export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.BmqjcfKB.js",app:"_app/immutable/entry/app.BIZOQ92Q.js",imports:["_app/immutable/entry/start.BmqjcfKB.js","_app/immutable/chunks/DQcPFxbt.js","_app/immutable/chunks/BnP7kZWx.js","_app/immutable/chunks/Bx5eiTM9.js","_app/immutable/entry/app.BIZOQ92Q.js","_app/immutable/chunks/Bx5eiTM9.js","_app/immutable/chunks/BnP7kZWx.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Bkh49w_q.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/dispatch",
				pattern: /^\/dispatch\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/reports",
				pattern: /^\/reports\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
