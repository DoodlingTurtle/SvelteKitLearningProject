import { browser } from "$app/environment";
import {openDB, deleteDB } from 'idb'

import DebugModule from './Debug'

const DBNAME = "app_storage";

let DB = null;

const debug = DebugModule.prefix("database");

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
        this._db = null;
        this._debug = debug.prefix(`.DatabseStore(${name})`)
    }

    /**
     * @param {IDBDatabase} db 
     * @param {IDBTransaction} tx 
     */
    install = async (db, tx) => {
        this._debug.log("install");
        let store = await db.createObjectStore(this._key, this._storeOpts);
        for(let a in this._indexes) {
            await store.createIndex(a, this._indexes[a].keyPath, this._indexes[a].options)
        }
    }


    /** 
     * @callback DatabaseHandlerTransactionCallback
     * @param {IDBObjectStore} store
     * @param {IDBTransaction} tx
     * @return {Promise.<any>}
     */

    /**
     * starts a transactions and provieds it to the handler 
     * @param {DatabaseHandlerTransactionCallback} handler 
     * @param {IDBTransactionMode} mode 
     */
    tx = async (handler, mode='readonly') => {
        let debug = this._debug.prefix(`.tx(callback, ${mode})`);
        /** IDBDatabase */
        if(this._db) {
            debug.log("transaction start in db", this._db);
            const tx = await this._db.transaction(this._key, mode );
            await handler(tx.store, tx, debug);
        }
        else throw new Error("no database");
    }

    getAll = async () => {
        let debug = this._debug.prefix(`.getAll()`);
        debug.log("start");
        const tx = await this._db.transaction(this._key, 'readonly');
        return await tx.store.getAll();
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
    let _debug = debug.prefix(".getDB()");
    if(!browser) {
        _debug.log("is not browser browser => skip database stuff");
        return;
    }

    if(!DB) {
        try {
            let retry = true;
            while(retry) {
                retry = false;

                DB = await openDB(DBNAME, version, {
                    upgrade: (db, oldV, newV, tx) => {
                        const __debug = _debug.prefix(".onUpdate");
                        let store = stores.shift();

                        while(store) {
                            if(!db.objectStoreNames.contains(store.name()))
                                store.install(db, tx);
                            else __debug.warn(` store '${store.name()}' exists`);

                            store = stores.shift()
                        }

                        localStorage.setItem(`${DBNAME}_db_version`, version);
                        __debug.log("finished", db, oldV, newV, tx);
                    },
                
                    blocked: (curV, blockedV, ev) => {
                        _debug.prefix(".onBlocked")
                              .error(`version ${blockedV} is blocked by version ${curV}`, ev, ev.currentTarget);
                    },

                    blocking: async (curV, blockedV, ev) => {
                        const __debug = _debug.prefix(".onBlocking");
                        __debug.warn(`version ${curV} is blocking ${blockedV}`, ev);
                        await ev.currentTarget.close()
                        __debug.log(`version ${curV} closed => retry open`)
                        retry = true; 
                    },

                    terminated: (ev) => {
                        _debug.prefix(".onTerminated")
                              .warn("connection has been terminated", ev)
                    }
                });
            }
            _debug.log("opened DB", DB); 
            return DB;
        }
        catch(err) {
            _debug.error("error", err)
        }
    }
    else return DB;

    throw new Error("[database.getDB] could not open Database");
}


async function closeDB() {
    const _debug = debug.prefix(".closeDB()")
    while(DB) {
        try { 
            await (await getDB()).close(); 
            DB = null;
        }
        catch(err) { _debug.error(err); }
    }
}


/**
 * @param {DatabaseStore} store 
 */
export const registerStore = async (store) => {
    if(!browser) return;
    if(!(store instanceof DatabaseStore)) throw new Error("not a DatabaseStore instance");

    const _debug = debug.prefix(`.registerStore(${store.name()})`);

    _debug.log('start');

    let db = await getDB();
    if(db && db.objectStoreNames.contains(store.name()) ) {
        _debug.log('store exists');
        store._db = db;
        return; //throw new Error('store exists');
    }
    
    stores.push(store);
    allStores.push(store);
    version++;

    await closeDB();
    db = await getDB();
    store._db = db;
};

export const clear = async () => {
    const _debug = debug.prefix(".clear()")
    if(!browser) return;

    await closeDB();

    let retry = true;

    while(retry) {
        retry = false;

        await deleteDB(DBNAME, {
            blocked: async (curV, ev) => {
                _debug.error(`version ${curV} is blocked from deletion => retry`, ev);
                await ev.currentTarget.close();
                retry = true;
            }
        })
    }

    localStorage.removeItem(`${DBNAME}_db_version`);
    version = 1;
}

export default { DatabaseStore, registerStore, clear}
