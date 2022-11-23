<script>
    import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition'
    export const contentClass="";
    export const backdropClass="";

    export let open = true;

    /** @type {HTMLElement}*/
    let me;

    onMount(  () => { document.body.appendChild(me); open = true; })
    onDestroy(() => { document.body.removeChild(me); open = false;})

    $: if(open) 
        document.body.style.overflow = "hidden";
    else 
        document.body.style.overflow = "";
    

</script>

<div class="modalContainer" in:fade out:fade bind:this={me}>
    <div class="modalBackdrop {backdropClass}"> </div>
    <div class="modalContent Modal {contentClass}"> 
        <slot />
    </div>
</div>

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
            z-index: 1;
        }

        .modalContent {
            flex-grow: 0;
            flex-shrink: 1;
            margin: 1rem;
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

            z-index: 2;
        }
    }
</style>