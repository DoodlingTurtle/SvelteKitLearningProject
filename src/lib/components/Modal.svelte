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
    <div class="modalContent Modal"> 
        <slot />
    </div>
</div>
{/if}

<style lang="scss">
    @import '../css/colors.sass';

    .modalContainer {
        position: fixed;
        inset: 0;

        display: flex;
        justify-content: center;
        place-items: center;

        z-index: 99999;

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
    }
</style>