import { DatabaseStore, registerStore } from '../../../lib/modules/database'
import { GET } from '$lib/modules/API';
import DebugModule from '$lib/modules/Debug';

const debug = DebugModule.prefix("UserModules");

/** @type {DatabaseStore} */
const store = new DatabaseStore(
    "user_modules", { keyPath: 'id' }, { "id": {keyPath: 'id', options: {unique: true}} } 
)

async function getAvailable() {
    const ret = {};

    await store.tx(async (st, tx) => {
        let cur = await st.openCursor();
        let obj = {};
        while(cur) {
            ret[cur.key] = cur.value.id;
            cur = await cur.continue();
        }
    })

    return ret;
}

export async function getInstance () {
    await registerStore(store);
       
    await GET("/users/modules", {expect: 'json'})
        .then( data => {
            data = data.data;

            debug.log("got data",data)
            store.tx((st, tx) => {
                debug.log("update")
                data.forEach( (element) => {
                    st.put(element);
                });
            }, 'readwrite') 
        });            

    return {
        getAvailable
    }
}



export default getInstance;
