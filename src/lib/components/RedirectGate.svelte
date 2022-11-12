<script type="ts">
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { cleanStore, loginPageErrorMessage, loggedin } from "$lib/stores";

    export let passcondition:boolean;
    export let logout:boolean=true;
    export let redirect:string="/";

    onMount(async () => { if(browser && !passcondition) {
        if($loggedin && logout) {
            await cleanStore();
            $loginPageErrorMessage = "You have been logged out, because you tried to access a restricted area.";
            goto("/login.html");
        }
        else goto(redirect);        
    }});

</script>
{#if passcondition}
    <slot />
{/if}