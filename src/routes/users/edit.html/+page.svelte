<script>
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    import { GET  } from "$lib/api";

    import PageTitle from "$lib/components/PageTitle.svelte";
    import Loader from "$lib/components/Loader.svelte";

    let uid = parseInt($page.url.searchParams.get("uid") || "0");
    let userdata;

    $: if(isNaN(uid)) uid = 0;
    
    $: userDataPromise = GET(`/user/${uid}`, {expect: 'json'}).then( data => userdata = data );

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
    {:catch err}
        {@const t1 = console.log(err)}
        Something went wrong 
    {/await}
</div>