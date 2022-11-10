<script>
    import PageTitle from '$lib/components/PageTitle.svelte';
    import { fade } from 'svelte/transition';
</script>

<div data-page="main" in:fade>
    <PageTitle alternateContainer="#ApplicationTitleBar" scrollListener="#AppContainer">Home</PageTitle>
    
    <article>
        <p>Welcome to my personal Website! <br />Enjoy your time here.</p>
        <p>Have a look around! </p>
    </article>
</div>