<script>
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation'
    import { cleanStore, loggedin } from '$lib/stores';
   
    $: show = (!$loggedin) ;   

    if(browser && $loggedin) goto("/");
</script>
{#if show}
<slot/>
{/if}