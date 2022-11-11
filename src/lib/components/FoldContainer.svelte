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
<div class="folding-container" class:open={open} bind:this={foldingcontainer} >
    <slot name="content"><em>no slot named &quot;content&quot; found</em></slot>
</div>


<script>
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    const dispatch = createEventDispatcher();
    
    export let open = true;
    $: dispatch("toggle", open);

    /**
     * @type {HTMLDivElement | null}
     */
    let foldingcontainer = null;

    const onFoldContainerAnimationEnd = () => {
        //only add Folding transition after the first animation played 
        // (Animations play as soon, as the item is added to the doem)
        if(foldingcontainer)
            foldingcontainer.style.transition = "max-height .5s";
    };
    
    const onFoldContainerAnimationStart = (/** @type {{ animationName: string; }} */ ev) => {
        if(ev.animationName == "folding-container-close") {
            if(foldingcontainer)
                foldingcontainer.style.maxHeight = foldingcontainer.offsetHeight + "px";

            window.setTimeout(() => {
                if(foldingcontainer)
                    foldingcontainer.style.maxHeight = ""
            });
        }
        else if (ev.animationName == "folding-container-open"){
            if(foldingcontainer)
                foldingcontainer.style.maxHeight = "";
        }
    };



    onMount(() => {
        if(foldingcontainer) {
            foldingcontainer.addEventListener("animationstart", onFoldContainerAnimationStart);
            foldingcontainer.addEventListener("animationend", onFoldContainerAnimationEnd);
        }
    })

    onDestroy(() => {
        if(foldingcontainer) {
            foldingcontainer.removeEventListener("animationstart", onFoldContainerAnimationStart);
            foldingcontainer.removeEventListener("animationend", onFoldContainerAnimationEnd);
        }
    })


</script>

<svelte:head><style>
    @keyframes folding-container-open {}
    @keyframes folding-container-close{}
</style></svelte:head>

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

    .folding-container {
        overflow: hidden;
        animation: folding-container-close .5s;
        max-height: 0px;
        
        &.open {
            animation: folding-container-open .5s;
            max-height: 1440px;
        }
    }

</style>