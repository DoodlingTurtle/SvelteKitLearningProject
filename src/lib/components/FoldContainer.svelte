<!-- 
Example:

<FoldContainer 
    // define initial state
    open=false 

    // react if opened or closed
    on:toggle={ (ev) => console.log("is open": ev.detail) } 
>
    // Slot = "legend" is the part that can be clicked on to toggle the container
    <h2 slot="legend">Toggle Trigger:</h2>

    // Slot = "content" is what get toggles
    <fieldset slot="content">
        I am the part that gets opened and closed
    </fieldset>

</FoldContainer>

-->



<a class:active={open} href={"#"} on:click|preventDefault={ () => open = !open }>
    <slot name="legend"><em>no slot named &quot;legend&quot; found</em></slot>
</a>
{#if open}
<div class="folding-container" transition:slide|local >
    <slot name="content"><em>no slot named &quot;content&quot; found</em></slot>
</div>
{/if}


<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    const on = createEventDispatcher();
    
    export let open = true;
    $: on("toggle", open);
    
</script>

<style lang='scss'>
    A {
        text-decoration: none;
        color: initial;
        font-size: initial;
        font-weight: initial;
        font-family: initial;
        border: none;
        padding: 0px;
        margin: 0px;
    }

    .folding-container { overflow: hidden; }

</style>