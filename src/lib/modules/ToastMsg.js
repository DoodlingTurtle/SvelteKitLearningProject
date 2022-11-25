class ToastMessage {
	/**
	 * @param {string} msg
	 * @param {string} color
	 * @param {number} time
	 */
	constructor(msg, color, time) {
		this.msg = msg || "";
		this.color = color || "transparent";
		this.time = time || 5000;
	}
}

/** @type {ToastMessage[]} */
const aToasts = [];


/** @typedef EventHandlerList 
 * @property {((ToastMessage) => void)[]} show
 * @property {(() => void)[]} hide
*/


/** @type {EventHandlerList} */
const eventListeners = { show: [], hide: []}

/** @type {number} */
let timeout;




/** @param {ToastMessage} t */
let onNewToastFnc = function(t) {
	aToasts.push(t)
	return Promise.resolve();
}

/** @returns {Promise.<ToastMessage|undefined>} */
let nextToastFnc = function() { return Promise.resolve(aToasts.shift()); }




/**
 * @callback onNewToastCallback
 * @param {ToastMessage} msg
 */
/** @param {onNewToastCallback} fnc */
function onNewToast(fnc) {
	if(typeof(fnc) == "function")
		onNewToastFnc = fnc;
}

/**
 * @callback nextToastCallback
 * @return {Promise.<ToastMessage|undefined>}
 */
/** @param {nextToastCallback} fnc */
function nextToast(fnc) {
	if(typeof(fnc) == "function")
		nextToastFnc = fnc;
}

/**
 * @param {'show'|'hide'} event
 * @param {(...any) => void} fnc
 */
function addEventListener(event, fnc) {

	/** @type {Array.<(...any) => void> | undefined} */
	let lst = eventListeners[event];

	if(lst) {
		lst.push(fnc);
		return () =>  lst = lst ? lst.filter( (e) => e != fnc ) : lst;
	}

	return () => false;
}


/**
 * @param {string} msg
 */
async function toast(msg, color="#ff0000", time=5000, showInstantly=true) {
	let prom = onNewToastFnc(new ToastMessage(msg, color, time)).then( flush );
	if (showInstantly)
		return prom.then(flush)
	else return prom;
}

async function syncToasts() {
	if(timeout) return;

	let t = await nextToastFnc();
	if(t) {

		eventListeners.show.forEach( (fnc) => fnc(t) )

		timeout = window.setTimeout( () => {
			eventListeners.hide.forEach( (fnc) => fnc() )

			timeout = 0;	
			window.setTimeout( syncToasts, 500 );

		}, t.time )
	}
}

function flush() { syncToasts(); }



export default {
	onNewToast,
	nextToast,
	toast,
	flush,
	addEventListener
}


















