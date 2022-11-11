<script>
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation'
    import { user_privilges } from '$lib/stores';
 
    $: show = (browser && $user_privilges.core||false) ;   
    $: if(browser && !show) {  goto("/"); }    

</script>
{#if show} <slot /> {/if}