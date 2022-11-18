<script>
    import PageTitle from "$lib/components/PageTitle.svelte";
    import {fade} from 'svelte/transition';
    import {page} from '$app/stores';

    let uid = $page.url.searchParams.get("uid");

</script>

<div class="page-user-edit" in:fade>
    <a href="./list.html">&larr; back</a>
    <PageTitle alternateContainer="#ApplicationTitleBar" scrollListener="#AppContainer">
        Edit User {uid}
    </PageTitle>
</div>