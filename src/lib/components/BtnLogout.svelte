<script>
    import {goto} from '$app/navigation';
    import { cleanStore, loggedin } from '$lib/modules/Stores';
    import DB from '$lib/modules/database'
    import Modal from './Modal.svelte';
    import {DELETE} from "$lib/modules/API";

    export let cssClass = "";

    let dialogOpen = false;

    const logout = async () => {
        await DB.clear(); 
        try { await DELETE('/session') }catch(e) { /* nop */ }
        cleanStore();

        goto("/"); 
    }

</script>
{#if $loggedin}
    <a href={"#"} class="btn {cssClass}" on:click|preventDefault={ () => dialogOpen=true } >
        <span class="fa fa-door-open"></span>
    </a>

    {#if dialogOpen}
    <Modal>
        <p class="f-bold">You are now leaving the Application</p>
        <a class="btn float-start" href={"#"} on:click|preventDefault={logout} >OK</a>
        <a class="btn float-end" href={"#"} on:click|preventDefault={ () => dialogOpen=false }>
            No, I did not mean to
        </a >
        <div style="clear: both" />
    </Modal>
    {/if}
{/if}
