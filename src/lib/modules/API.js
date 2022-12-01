// @ts-nocheck
import {api_token, api_url} from '$lib/modules/Stores'

const statusEventHandlers = { }
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

let apiurl = "";
let Authorization = "";

api_token.subscribe(obj => Authorization = `Bearer ${obj}` );
api_url  .subscribe(obj => { console.log("apiurl-update: ", obj); apiurl = obj } );

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

	return new Promise(async (resolve, reject) => {

		if(typeof(apiurl) != 'string' || apiurl.trim() == "") {
			let settings = await (await fetch("/settings.json")).json();
			apiurl = settings.defaultAPIURL;
			api_url.set(settings.defaultAPIURL);
		}

		/** @type {Response|null} */
		let oRes = null;
		fetch(`${apiurl}${url}`, options)
			.then(data => {

				switch(data.status) {
					case 200:	/* OK */
					case 201:	/* Created */
					case 202:	/* Accepted */
					case 204:	/* No Content */
					case 205:	/* Reset Content */
					case 206:	/* Partial Content */
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

						case 'text': data.text().then(txt => {
							data.data = txt;
							reject(data)
						});
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

function contentTypePreProcess(opts={}, body=null) {

	const optOverride = {};

	// extract headers from opts
	const optHeaders = opts.headers || {};
	delete opts.headers;

	// extract contenttype from header
	let contentTypeHeader = "";
	let contentType = "";

	Object.keys(optHeaders).map( h => {
		switch(h.toLowerCase()) {
			case 'content-type':
				contentTypeHeader = h;
				contentType = optHeaders[h].toLowerCase();
				delete optHeaders[h];
				break;
		}
	})

	if(!contentTypeHeader.trim()) 	contentTypeHeader = "content-type";

	switch(contentType) {
		case 'application/json':
			optOverride.body = JSON.stringify(body);			
			break;

		default:
			optOverride.body = (new URLSearchParams(body)).toString();
			optHeaders[contentTypeHeader] = 'application/x-www-form-urlencoded';
	}

	return {
		...opts, 
		...optOverride,
		'headers': optHeaders	
	}
}

export function GET(url, opts={}) 		 { return call("get", url, opts); }
export function DELETE(url, opts={}) 	 { return call("delete", url, opts); }
export function POST(url, body, opts={}) { 
	return call("post", url, contentTypePreProcess(opts, body) ) 
}
export function PUT(url, body, opts={}) { 
	return call("put", url, contentTypePreProcess(opts, body) ) 
}
export function PATCH(url, body, opts={}) { 
	return call("PATCH", url, contentTypePreProcess(opts, body) )
}

export default { GET, POST, PUT, PATCH, DELETE, addResponseListener, removeResponseListener }