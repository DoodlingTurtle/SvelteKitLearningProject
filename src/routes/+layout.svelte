<script>
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
    import API from '$lib/modules/API';
    import { goto } from '$app/navigation';
    import { cleanStore, loginPageErrorMessage } from '$lib/modules/Stores';

    import { page } from '$app/stores';


    import ToastMsg from './ToastMsg.svelte';
    import PageTransition from './PageTransition.svelte';

    //======================================================================
    // Logout if server can't find an Answer
    //======================================================================
    API.addResponseListener(403, async (res) => {
        await cleanStore();
        $loginPageErrorMessage = "Your Session has been closed. Reasons can be:\n" 
            + "- your session was closed because you deleted it from the Settings page\n"
            + "- you tried to access a function that your account has been denied access to\n"
            + "- their is a problem involving our servers. In that case, you are logged out for your own protection";

        goto("/login.html");
    })

</script>

<div id="AppContainer">
    <PageTransition url={$page.url.pathname} duration={500}>
        <slot />
    </PageTransition>
</div>

<Navi />

<Headline />
<Footline />

<ToastMsg />