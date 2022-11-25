<script lang="ts">
    //======================================================================
    // Styles and Scripts
    //======================================================================
    import '$lib/css/main.sass';
    import '$lib/css/utils.scss';

    //======================================================================
    // Components
    //======================================================================
    import Headline from './Headline.svelte';
    import Navi from './Navi.svelte';
    import Footline from './Footline.svelte';

    //======================================================================
    // Modules
    //======================================================================
    import API from '$lib/api';
    import { goto } from '$app/navigation';
    import { cleanStore, loginPageErrorMessage } from '$lib/stores';
    import ToastMsg from './ToastMsg.svelte';

    //======================================================================
    // Logout if server can't find an Answer
    //======================================================================
    API.addResponseListener(403, async (res: any) => {
        await cleanStore();
        $loginPageErrorMessage = "Your Session has been closed. Reasons can be:\n" 
            + "- your session was closed because you deleted it from the Settings page\n"
            + "- you tried to access a function that your account has been denied access to\n"
            + "- their is a problem involving our servers. In that case, you are logged out for your own protection";

        goto("/login.html");
    })

</script>

<div id="AppContainer">
    <slot />
</div>

<Navi />

<Headline />
<Footline />

<ToastMsg />