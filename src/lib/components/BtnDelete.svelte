<script>
    import { createEventDispatcher } from "svelte";
    import Modal from "./Modal.svelte";

    const on = createEventDispatcher();
    export let name = "";
    export let labelYes = "OK";
    export let labelNo = "No, I did not mean to";

    /** @type {string|undefined} */
    export let confirmMsg;

    const onClick = () => {
        if(confirmMsg) 
            dialogOpen = true;
        else
            on("click", name)
    }

    let dialogOpen = false;

</script>

<a 
    href={"#"} 
    class="btn listoption" 
    on:click|preventDefault={onClick}
>
    <li class="fa fa-trash"/>
</a>

{#if dialogOpen}
<Modal>
    <div>
        <p class="f-bold">{confirmMsg}</p>
        <a class="btn float-start" href={"#"} on:click|preventDefault={() => {
            on("click", name);
            dialogOpen = false;
        }} >{labelYes}</a>
        <a class="btn float-end" href={"#"} on:click|preventDefault={ () => dialogOpen=false }>
            {labelNo}
        </a >
        <div style="clear: both" />
    </div>
</Modal>
{/if}

<style>
    DIV {
    }
</style>