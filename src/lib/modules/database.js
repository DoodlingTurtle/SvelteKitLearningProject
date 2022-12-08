import { browser } from "$app/environment";
import {openDB, deleteDB, unwrap } from 'idb'
import { get } from "svelte/store";

const DBNAME = "app_storage";

let DB = null;

/** 
 * 'opts' parameter available to DatabaseStore 
 * @typedef StoreOpts
 * @property {(string|Iterable<string>)} keyPath?  
 * @property {boolean} autoIncrement?
*/

/** 
 * 'options' available to StoreIndex
 * @typedef StoreIndexOptions
 * @property {boolean} multiEntry?
 * @property {boolean} unique?
*/

/** 
 * 'indexes' available to DatabaseStore.construct 
 * @typedef StoreIndex
 * @property {string|Iterable<string>} keyPath? 
 * @property {StoreIndexOptions} options?  
 */

export class DatabaseStore {

    /**
     * @param {string} name 
     * @param {StoreOpts} opts 
     * @param {Object.<string, StoreIndex>} indexes 
     */
    constructor(name, opts, indexes={}) {
        this._key = `${name}`;
        this._storeOpts = opts;
        this._indexes = indexes;
    }

    /**
     * @param {IDBDatabase} db 
     * @param {IDBTransaction} tx 
     */
    install = async (db, tx) => {
        let store = await db.createObjectStore(this._key, this._storeOpts);
        for(let a in this._indexes) {
            await store.createIndex(a, this._indexes[a].keyPath, this._indexes[a].options)
        }
    }

    name() { return this._key };
}


/** @type DatabaseStore[] */
const allStores = [];
const stores = [];
let version = 0;
if(browser) {
    version = localStorage.getItem(`${DBNAME}_db_version`) || 1;
    localStorage.setItem(`${DBNAME}_db_version`, version);
}

async function getDB() {
    if(!browser) return;
    if(!DB) {
        try {
            DB = openDB(DBNAME, version, {
                upgrade: (db, oldV, newV, tx) => {
                    let store = stores.shift();

                    while(store) {
                        store.install(db, tx);
                        store = stores.shift()
                    }

                    localStorage.setItem(`${DBNAME}_db_version`, version);
                },
            
                blocked: (curV, blockedV, ev) => {
                    console.error(`Database version ${blockedV} is blocked by version ${curV}`, ev);
                },

                blocking: (curV, blockedV, ev) => {
                    console.error(`Database version ${curV} is blocking ${blockedV}`, ev);
                }
            });
        }
        catch(err) {
            console.error("[database.getDB] error", err)
            DB = Promise.resolve(null);
        }
        return DB;
    }
    if(!DB) throw "could not get DB";

    return DB;
}


/**
 * @param {DatabaseStore} store 
 */
export const registerStore = async (store) => {
    if(!browser) return;
    if(!(store instanceof DatabaseStore)) throw new Error("not a DatabaseStore instance");

    let db = await getDB();
    if(db && db.objectStoreNames.contains(store.name()) ) return; //throw new Error('store exists');
    
    stores.push(store);
    allStores.push(store);

    version++;

    await (() => new Promise(async (reject, resolve) => {
        try { await db.close(); DB = null; }
        catch( err ) { console.error("failed to close db", err) }

        try { await getDB(); }
        catch( err ) { console.error("failed to reopen db", err) }
    }))()

};

export const clear = async () => {
    if(!browser) return;
    console.log(DB);
    if(DB) {
        try { await (await getDB()).close(); }
        catch(err) { console.warn("[database.clear] warning ", err); }
    }
    DB = null;

    let success = false;

    while(!success) {
        success = true;
        await deleteDB(DBNAME, {
            blocked: (curV, ev) => {
                console.error(`Database version ${curV} is blocked from deletion`, ev);
                success = false;
            }
        })
    }
    localStorage.removeItem(`${DBNAME}_db_version`);
}



export default { DatabaseStore, registerStore, clear}