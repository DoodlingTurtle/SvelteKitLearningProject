<script>
    import PageTitle from "$lib/components/PageTitle.svelte";
    import { fade } from "svelte/transition";
</script>


<div class="page-users-list" in:fade>
    <PageTitle alternateContainer="#ApplicationTitleBar" scrollListener="#AppContainer">Userlist</PageTitle>
</div>