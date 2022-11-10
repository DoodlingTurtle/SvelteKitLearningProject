


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

/** @constant {Array.<ToastMessage>} aToasts  */
const aToasts = [];
let timeout;
let toastContainer;


/** @param {ToastMessage} t */
let onNewToastFnc = function(t) {
	aToasts.push(t)
	return Promise.resolve();
}

/** @returns {Promise.<ToastMessage>} */
let nextToastFnc = function() { return Promise.resolve(aToasts.shift()); }

/** @return void */
let onToastFnc = function() { console.warn("ToastMsgOnToast") }




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
 * @return {Promise.<ToastMessage>}
 */
/** @param {nextToastCallback} fnc */
function nextToast(fnc) {
	if(typeof(fnc) == "function")
		nextToastFnc = fnc;
}

/**
 * @param {'show'|'hide'} event
 */
function addEventListener(event, fnc, opts) {
	document.addEventListener("ToastMsg."+event, fnc, opts);
	return () => document.removeEventListener("ToastMsg."+event, fnc);
}


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

		const ev = new CustomEvent("ToastMsg.show", { detail: t });
		document.dispatchEvent(ev);

		timeout = window.setTimeout( () => {
			const ev = new Event("ToastMsg.hide");
			document.dispatchEvent(ev);

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


















