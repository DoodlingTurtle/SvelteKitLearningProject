// @ts-nocheck
import {api_token, api_url} from '$lib/modules/Stores'
import { browser } from '$app/environment';
import DebugModule from '../modules/Debug'

const debugbase = DebugModule.prefix("API")

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
api_url  .subscribe(obj => apiurl = obj  );

function apacheURLParams(paramsObj, prefix='', output=null) {

    if(!output) output = new URLSearchParams();

    if(Array.isArray(paramsObj)) {
        if(!prefix) throw 'array cant be the first layer. First layer must be an object';

        paramsObj.forEach((e, i) => {
            apacheURLParams(e, `${prefix}[${i}]`, output);
        }) 
    }

    else if(typeof(paramsObj) == 'object') {
        for(let a in paramsObj) {
            const newPrefix = prefix ? `${prefix}[${a}]` : a;
            apacheURLParams(paramsObj[a], newPrefix, output);
        }
    }

    else {

        if(!prefix) throw 'First layer must be an object';

        const ap = `${prefix}[]`

        if(output.has(prefix) && !output.has(ap)) {
            output.append(ap, output.get(prefix));       
            output.delete()
        }

        if(output.has(ap)) output.append(ap    , paramsObj);
        else               output.append(prefix, paramsObj);
    } 

    return output.toString();

}

async function call(method, url, opts, debugbase) {

    const debug = debugbase.prefix("("+url+")")

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

    const processResponse = async (data) => {
        const _debug = debug.prefix(".processResponse()")

        switch(data.status) {
            case 200:	/* OK */
            case 201:	/* Created */
            case 202:	/* Accepted */
            case 204:	/* No Content */
            case 205:	/* Reset Content */
            case 206:	/* Partial Content */
                    switch (resType) {
                        case 'json'		  : data.data = await data.json();        break;
                        case 'text'		  : data.data = await data.text();        break;
                        case 'formData'	  : data.data = await data.formData();    break;
                        case 'blob'		  : data.data = await data.blob();        break;
                        case 'arrayBuffer': data.data = await data.arrayBuffer(); break;
                    }
                return data;

            case 400:
            case 404:
            case 405:
            case 500:   /* Internal Server Error */
                    data.data = await data.text();

            default:
                if(data.status != 503)
                    _debug.warn("unexpected response", data);

                if(!ignore[data.status] && statusEventHandlers[data.status]) {
                    statusEventHandlers[data.status].forEach( (h) => {
                        h(data);
                    } )
                }

                throw data;	
        }
    }

    if(!browser) {
        debug.log("is Server side => respond with 503 Service Unavailabe");

        let resdata = null;
        switch (resType) {
            case 'json'		  : resdata = new ReadableStream("{}");   break;
            case 'formData'	  : resdata = new FormData();   break;
            case 'blob'		  : resdata = new Blob();   break;
            case 'arrayBuffer': resdata = new ArrayBuffer();   break;
            default			  : resdata = new ReadableStream("");   break;
        }

        const response = new Response(resdata, {
            status: 503, statusText: "Service Unavailable"
        });

        return await processResponse(response)
    }
    else {
        return (async () => {

            if(typeof(apiurl) != 'string' || apiurl.trim() == "") {
                debug.warn("missing apiurl => fetching /settings.json first");
                let settings = await (await fetch("/settings.json")).json();

                apiurl = settings.defaultAPIURL;
                debug.log("got settings => update apiurl to ", apiurl);
                api_url.set(settings.defaultAPIURL);
            }

            debug.log("run fetch")
            const res = await processResponse(await fetch(`${apiurl}${url}`, options));
            debug.log("got", res)
            return res;

        })()
    }
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
            optHeaders[contentTypeHeader] = 'application/json';
            break;

        default:
            optOverride.body = apacheURLParams(body);
            optHeaders[contentTypeHeader] = 'application/x-www-form-urlencoded';
    }
 
    return {
        ...opts, 
        ...optOverride,
        'headers': optHeaders	
    }
}

function prepareURL(url, params) {
    return url + (
        (typeof(params) == 'object')
            ?('?' + apacheURLParams(params))
            :('')
    ) 
}

export function GET(url, opts={}, params=null){ 
    return call( "get", prepareURL(url, params), opts, debugbase.prefix(".GET") ); 
}

export function DELETE( url,  opts={}, params=null) { 
    return call("delete", prepareURL(url, params), opts, debugbase.prefix(".DELETE")); 
}

export function POST(url, body, opts={}) { 
    return call("post", url, contentTypePreProcess(opts, body), debugbase.prefix(".POST") ) 
}

export function PUT(url, body, opts={}) { 
    return call("put", url, contentTypePreProcess(opts, body), debugbase.prefix(".PUT") ) 
}

export function PATCH(url, body, opts={}) { 
    return call("PATCH", url, contentTypePreProcess(opts, body), debugbase.prefix(".PATCH") )
}

export default { GET, POST, PUT, PATCH, DELETE, addResponseListener, removeResponseListener }
