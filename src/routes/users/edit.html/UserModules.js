import { writable } from 'svelte/store';

import { DatabaseStore, registerStore } from '../../../lib/modules/database'
import { GET } from '$lib/modules/API';
import DebugModule from '$lib/modules/Debug';
import { empty } from '$lib/modules/Utils';

const debug = DebugModule.prefix("UserModules");

/** @type {DatabaseStore} */
const store = new DatabaseStore(
    "user_modules", 
    { keyPath: 'id' }, 
    { "id": {keyPath: 'id', options: {unique: true}} } 
)

export const user_modules = new writable([], (set) => {
    user_modules.pset = set; 
    (async () => {
        let ret = [];
        await registerStore(store);
        ret = await store.getAll();

        if(empty(ret))
            reload();
        else set(ret);
    })()

    return () => { set([]) }
});

user_modules.set = async function(val) {

    const _debug= debug.prefix(".user_mdoules.set()");
    _debug.log("start");

    if(!(val instanceof Array)) {
        _debug.warn("value is not an array. erasing all data");
        val = [];
    }

    await registerStore(store);
    await store.tx((store, tx) => {
        val.forEach( async (e, i, a) => {
            if(!e) return;
            _debug.log("put ", e, await store.put(e))
        } )
    }, 'readwrite');

    _debug.log("set parent value");
    user_modules.pset(val);

}

export async function reload() {
    const _debug = debug.prefix(".update()")
    _debug.log("Start update")

    const res = await GET("/users/modules", {expect: 'json'});
    const data = res.data; 

    if(data) {
        switch(res.status) {
            case 204: /* No Content */
                _debug.log("no update needed");
                break;

            case 205: /* Reset Content */
                _debug.log("server requests content reset");
                await clear();

            case 200:
                _debug.log("update store")
                await user_modules.set(data);
        }
    }
}

export async function clear() {
    const _debug = debug.prefix(".clear()")
    _debug.log("reset store");
    user_modules.set([]);
}



export default { reload, user_modules, clear }






