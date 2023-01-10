<script>
    import { getContext, onMount } from "svelte";
    import FoldContainer from "../../../lib/components/FoldContainer.svelte";

    import { GET } from '../../../lib/modules/API.js'
    import { user_modules } from '../../../lib/modules/UserModules.js'
    
    let context = getContext("settingsfrm");

    let availableModules = {}
    let userModules = []; 

    $: if($user_modules) {
        availableModules = {};
        $user_modules.map( e => availableModules[e.id] = e.description );
    }
    
    onMount(() => GET(
        '/user_rights', 
        {expect: 'json'},
        {columns: [ 'rights_id' ]}
    ).then(res => userModules = res.data));

</script>
    
<FoldContainer open={context.modulesFold} on:toggle={(ev) => {(context.modulesFold = ev.detail); }} >
    <h2 slot="legend" class="btn {context.modulesFold ? 'active' : ''}">Modules:</h2>
    <fieldset slot="content">
        <p class="mt-1 mb-0 mt-sm-1 mb-sm-3">These are the modules, that your Account is able to use.</p>
        <dl>
        {#each userModules as mod}
            <dt>{mod}</dt>
            <dd class="mb-4">{availableModules[mod]}</dd>
        {/each}
        </dl>
    </fieldset>
</FoldContainer>

<style>
    dt { font-weight: bold; }
</style>
