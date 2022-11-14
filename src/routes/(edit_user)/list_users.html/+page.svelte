<script>
    import PageTitle from "$lib/components/PageTitle.svelte";
    import { fade } from "svelte/transition";

     let list = [];

    


</script>


<div class="page-users-list" in:fade>
    <PageTitle alternateContainer="#ApplicationTitleBar" scrollListener="#AppContainer">Userlist</PageTitle>

    {#each list as entry}
        <article>
            
        </article>
    {/each}

</div>