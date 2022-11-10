<script>
    import { fade } from 'svelte/transition'
    export let contentClass = "";
    export let backdropClass = "";

    export let open = true;

    $: if(open)
        document.querySelector("BODY").style.overflow = "hidden";
    else 
        document.querySelector("BODY").style.overflow = "";
    
</script>

{#if open}
<div class="modalContainer" in:fade out:fade>
    <div class="modalBackdrop {backdropClass}"> </div>
    <div class="modalContent {contentClass}"> 
        <slot />
    </div>
</div>
{/if}

<style lang="scss">
    .modalContainer {
        position: fixed;
        inset: 0;

        display: flex;
        justify-content: center;
        place-items: center;

        .modalBackdrop {
            display:block;
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, .666);
            z-index: -1;
        }

        .modalContent {
            flex-grow: 0;
            flex-shrink: 0;
            padding: var(--border-rad);
            border-radius: var(--border-rad);
        }
    }
</style>