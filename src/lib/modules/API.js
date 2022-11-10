import STORE from '../stores'

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
	const ignore = { 404: opts.ignore404 ? true : false };

	if (opts.expect) delete opts.expect;
	if (opts.ignore404) delete opts.ignore404;

	const options = {
		headers: {},

		...opts,

		method,
		credentials: 'include',
	}

	options.headers.Authorization = Authorization

	return new Promise((resolve, reject) => {
		let oRes = null;
		fetch(`${apiurl}${url}`, options)
			.then(data => {
				oRes = data;
				switch (resType) {
					case 'json': return data.json();
					case 'text': return data.text();
					case 'formData': return data.formData();
					case 'blob': return data.blob();
					case 'arrayBuffer': return data.arrayBuffer();
					default: return Promise.resolve(undefined)
				}
			})
			.then(data => {
				oRes.data = data
				resolve(oRes);
			})
			.catch( (...args) => {
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


export default { GET, DELETE, addResponseListener, removeResponseListener }