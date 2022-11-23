// @ts-nocheck
import STORE from '$lib/stores'

const statusEventHandlers = {

}

let apiurl = "";
let Authorization = "";

STORE.api.subscribe(obj => {
	apiurl = obj.url;
	Authorization = `Bearer ${obj.token}`
});

function call(method, url, opts) {
	const resType = opts.expect || "";
	const ignore = {};

	Object.keys(opts).forEach((k) => {
		const ma = k.match(/^ignore([0-9]+)$/);
		if(ma) {
			ignore[ma[1]] = true;
			delete opts[k];
		}
	})

	if (opts.expect) delete opts.expect;

	const options = {
		headers: {},

		...opts,

		method,
		credentials: 'include',
	}

	options.headers.Authorization = Authorization

	return new Promise((resolve, reject) => {
		/** @type {Response|null} */
		let oRes = null;
		fetch(`${apiurl}${url}`, options)
			.then(data => {

				switch(data.status) {
					case 200:
						oRes = data;
						switch (resType) {
							case 'json': return data.json();
							case 'text': return data.text();
							case 'formData': return data.formData();
							case 'blob': return data.blob();
							case 'arrayBuffer': return data.arrayBuffer();
							default: return Promise.resolve(undefined)
						}
						break;

					default:
						console.log("unexpected response", data);
						if(!ignore[data.status] && statusEventHandlers[data.status]) {
							statusEventHandlers[data.status].forEach( (h) => {
								h(data);
							} )
						}

						case 'text': data.text().then( txt => reject(new Error(txt))  );
						return null;

				}

			})
			.then(data => {
				if(oRes) {
					oRes.data = data
					resolve(oRes);
				}
			})
			.catch( (...args) => {
				console.log("error during fetch", args);
				if(oRes && oRes.status && !ignore[oRes.status] && statusEventHandlers[oRes.status]) {
					statusEventHandlers[oRes.status].forEach( (h) => {
						h(oRes);
					} )
				}

				reject.apply(null, args)
			} )
	});
}



export function GET(url, opts={}) {
	return call("get", url, opts);
}

export function DELETE(url, opts={}) {
	return call("delete", url, opts);
}

export function POST(url, body, opts={}) {
	return call("post", url, {...opts, body})
}

export function addResponseListener(httpStatus, handler) {
	if(typeof(handler) != 'function') return;
	const s = parseInt(httpStatus);
	if(!statusEventHandlers[s]) statusEventHandlers[s] = [];
	statusEventHandlers[s].push(handler);
}

export function removeResponseListener(httpStatus, handler) {
	const s = parseInt(httpStatus);
	if(!statusEventHandlers[s]) return;

	statusEventHandlers[s] = statusEventHandlers[s].filter((h) => h !== handler);
}


export default { GET, POST, DELETE, addResponseListener, removeResponseListener }