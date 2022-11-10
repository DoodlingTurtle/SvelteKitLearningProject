import { cleanStore, createLocalStore, createVarStore} from "$lib/modules/SvelteKitStaticStoreCreators";
export { cleanStore } from '$lib/modules/SvelteKitStaticStoreCreators'

const defaultAPIURL = import.meta.env.VITE_API_BASE || "";

console.log("default URL:", defaultAPIURL);

//=======================================================================================
// Browser-Storage
//=======================================================================================
 export let username = createLocalStore("username", "");
 export let loggedin = createLocalStore("loggedin", false);
 export let user_privilges = createLocalStore("user_privileges", {core: false});
 export let api            = createLocalStore("api", {
        url: defaultAPIURL,
        token: ""
    });

//=======================================================================================
// Variable-Storage
//=======================================================================================
export let menuOpen = createVarStore(false);
export let loginPageErrorMessage = createVarStore("");

export default { api, username, loggedin, user_privilges, cleanStore, loginPageErrorMessage }