<script>
    import { getContext } from "svelte";
    import FoldContainer from "$lib/components/FoldContainer.svelte";
    
    let context = getContext("settingsfrm");
    export let data = {}

</script>
    
<FoldContainer open={context.modulesFold} on:toggle={(ev) => {(context.modulesFold = ev.detail); }} >
    <h2 slot="legend" class="btn {context.modulesFold ? 'active' : ''}">Modules:</h2>
    <fieldset slot="content">
        <p class="mt-1 mb-0 mt-sm-1 mb-sm-3">These are the modules, that your Account is able to use.</p>
        <dl>
        {#each Object.keys(data['rights']) as prop}
            {@const right = data['rights'][prop]}
            <dt>{right.right}</dt>
            <dd class="mb-4">{right.description}</dd>
        {/each}
        </dl>
    </fieldset>
</FoldContainer>

<style>
    dt { font-weight: bold; }
</style>