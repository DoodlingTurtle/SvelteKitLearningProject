<script>
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    import { GET  } from "$lib/modules/API";

    import PageTitle from "$lib/components/PageTitle.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import SwtichList from '../../../lib/components/SwtichList.svelte';

    let uid = parseInt($page.url.searchParams.get("uid") || "0");
    let userdata;

    $: if(isNaN(uid)) uid = 0;
    $: userDataPromise = GET(`/user/${uid}`, {expect: 'json'}).then( data => userdata = data );

    let availableModules = {
        'opt1': "Option 1",
        'opt2': "Option 2",
        'opt3': "Option 3",
        'opt4': "Option 4",
    };

    let assignedModules = ['opt1', 'opt3'];

</script>

<div class="page-user-edit" in:fade>
    <a href="./list.html">&larr; back</a>
    <PageTitle alternateContainer="#ApplicationTitleBar" scrollListener="#AppContainer">
        Edit User {uid}
    </PageTitle>

    {#await userDataPromise}
        <Loader /> 
    {:then unused} 
        // TODO Implement


        <SwtichList source={availableModules} bind:value={assignedModules} />

        
    {:catch err}
        {@const t1 = console.log(err)}
        Something went wrong 
    {/await}
</div>