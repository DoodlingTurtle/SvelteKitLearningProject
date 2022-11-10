// @ts-nocheck
import { browser } from "$app/environment";
import { writable } from 'svelte/store'

const resetHandlers = [];

// Variables, that stay even if the browser is closed
export function createLocalStore(key_name, def) {
    if(browser) {
        const str = writable(getDefault(localStorage, key_name, def));
        str.subscribe(data => localStorage.setItem(key_name, JSON.stringify(data)));

        resetHandlers.push(() => {
            str.set(def);
            if (!def) localStorage.removeItem(key_name);
            else localStorage.setItem(key_name, def);
        });

        return str;
    }
    else return createVarStore(def);
}

// Variables, that stay until the browser is closed
export function createSessionStore(key_name, def) {
    if(browser) {
        const str = writable(getDefault(sessionStorage, key_name, def));
        str.subscribe(data => sessionStorage.setItem(key_name, JSON.stringify(data)));

        resetHandlers.push(() => {
            str.set(def);
            if (!def) localStorage.removeItem(key_name);
            else localStorage.setItem(key_name, def);
        });

        return str;
    }
    else return createVarStore(def);
}

// Variables that stay until the page is reloaded
export function createVarStore(def) {
    const str = writable(def);
    resetHandlers.push(() => str.set(def));
    return str;
}

function getDefault(store, store_name, def) {
    try {
        const r = JSON.parse(store.getItem(store_name));
        if (!r) return def;
        else return r;
    } catch (e) {
        return def;
    }
}

export const cleanStore = () => { resetHandlers.forEach(h => h()); }


export default {
    createLocalStore,
    createSessionStore,
    createVarStore,
    cleanStore
}