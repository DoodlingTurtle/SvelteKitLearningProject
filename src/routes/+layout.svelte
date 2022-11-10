<script lang="ts">
    import '/src/lib/css/main.sass';
    import Headline from '$lib/components/Headline.svelte';
    import Navi from '$lib/components/Navi.svelte';
</script>

<div id="AppContainer">
    <slot />
</div>

<Navi />

<Headline />