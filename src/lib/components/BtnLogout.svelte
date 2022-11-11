<script>
    import {goto} from '$app/navigation';
    import { api, cleanStore, loggedin } from '$lib/stores';
    import Modal from './Modal.svelte';
    import {DELETE} from "../modules/API.js";

    export let cssClass = "";

    let dialogOpen = false;

    const logout = async () => {
        try {
            await DELETE('/session')
        }catch(e) { /* nop */ }

        cleanStore();
        goto("/"); 
    }

</script>

<!----------------------------------------------------------------------------------
| Dialog Markup
----------------------------------------------------------------------------------->
{#if $loggedin}
    <a href={"#"} class="btn {cssClass}" on:click|preventDefault={ () => dialogOpen=true } >
        <span class="fa fa-door-open"></span>
    </a>

    {#if dialogOpen}
    <span class={"modalwrapper"}>
    <Modal contentClass={"Modal"} open={dialogOpen}>
        <p class="f-bold">You are now leaving the Application</p>
        <a class="btn float-start" href={"#"} on:click|preventDefault={logout} >OK</a>
        <a class="btn float-end" href={"#"} on:click|preventDefault={ () => dialogOpen=false }>
            No, I did not mean to
        </a >
        <div style="clear: both" />
    </Modal>
    </span>
    {/if}
{/if}

<!----------------------------------------------------------------------------------
| Styles
----------------------------------------------------------------------------------->
<style lang="scss">
    @import '../css/colors.sass';

    .modalwrapper {
        :global(.Modal) {
            border: none;
            outline: none;
            box-shadow: 2px 2px 4px var(--shadow);
            border-radius: var(--border-rad);
            color: var(--accent-text);
            @include gradient-bg;
            
            :global(.btn) {
                background-color: var(--accent-text);
                color: black;
            }
        }

        z-index: 99999;

    }
</style>
