import { cleanStore, createLocalStore, createVarStore} from "$lib/modules/SvelteKitStaticStoreCreators";
export { cleanStore } from '$lib/modules/SvelteKitStaticStoreCreators'

//=======================================================================================
// Browser-Storage
//=======================================================================================
export let username     = createLocalStore("username", "");
export let loggedin     = createLocalStore("loggedin", false);
export let user_modules = createLocalStore("user_modules", {core: false});
export let api_token    = createLocalStore("api_token", "");
export let api_url      = createLocalStore("api_url", "");

//=======================================================================================
// Variable-Storage
//=======================================================================================
export let menuOpen              = createVarStore(false);
export let loginPageErrorMessage = createVarStore("");

export default { api_token, username, loggedin, user_modules, cleanStore, loginPageErrorMessage }