<script>
    import { fade } from 'svelte/transition'
    export let url = "";
    export let duration = 500;

</script>

{#key url}
    <div 
        in:fade={{duration, delay: 20}}
    >
        <slot />
    </div>
{/key}