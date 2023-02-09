import { createServer } from "http-proxy";

// proxy the piston API, just like we do in production
const httpProxy = createServer({
	target: 'http://127.0.0.1:2000'
});

const wsProxy = createServer({
	target: 'ws://127.0.0.1:2000',
	ws: true
});

[httpProxy, wsProxy].forEach((proxy, i) => {
	// remove existing CORS headers and allow everyone
	proxy.on('proxyRes', (proxyRes) => {
		proxyRes.headers = {
			...Object.keys(proxyRes.headers)
				.filter(h => (!h.toLowerCase().startsWith('access-control-') && !h.toLowerCase().startsWith('vary')))
				.reduce((all, h) => ({ ...all, [h]: proxyRes.headers[h] }), {}), ...{
					"Access-Control-Allow-Origin": "*"
				}
		};
	});

	proxy.listen(2000 + i + 1);
})

