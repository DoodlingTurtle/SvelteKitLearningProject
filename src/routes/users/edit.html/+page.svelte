<script>
    import { fade } from "svelte/transition";
    import { page } from "$app/stores";
    import { GET } from "$lib/modules/API";

    import PageTitle from "$lib/components/PageTitle.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import SwtichList from "$lib/components/SwtichList.svelte";
    import FoldContainer from "$lib/components/FoldContainer.svelte";

    let uid = parseInt($page.url.searchParams.get("uid") || "0");
    let userdata;

    $: if (isNaN(uid)) uid = 0;
    $: userDataPromise = GET(`/user/${uid}`, { expect: "json" }).then(
        (data) => (userdata = data)
    );

    let availableModules = {
        opt1: "Option 1",
        opt2: "Option 2",
        opt3: "Option 3",
        opt4: "Option 4",
        opt5: "Option 5",
        opt14: "Option 14",
    };

    let assignedModules = ["opt1", "opt3"];
</script>

<div class="page-user-edit" in:fade>
    <a href="./list.html">&larr; back</a>
    <PageTitle
        alternateContainer="#ApplicationTitleBar"
        scrollListener="#AppContainer"
    >
        Edit User {uid}
    </PageTitle>

    {#await userDataPromise}
        <Loader />
    {:then unused}
        <FoldContainer>
            <h2 slot="legend" class="btn">Modules:</h2>

            <fieldset slot="content">
                <SwtichList
                    height="16"
                    source={availableModules}
                    bind:value={assignedModules}
                />
            </fieldset>
        </FoldContainer>
    {:catch err}
        {@const t1 = console.log(err)}
        Something went wrong
    {/await}
</div>

<style lang="scss">
    @import "colors.sass";
    @import "media.sass";

    :global([slot="legend"]) {
        cursor: pointer;

        margin-top: 0px;
        margin-bottom: 0px;
        font-size: 1em;

        font-weight: bold;
        display: block;
        padding: 0.25rem;

        box-shadow: 0 0 4px var(--shadow);
        color: white;

        border-radius: var(--border-rad);

        @include gradient_bg;
    }

    :global(A.active:has([slot="legend"]) [slot="legend"]) {
        border-radius: var(--border-rad) var(--border-rad) 0 0;
    }

    :global([slot="content"]) {
        border: none;
        background-color: var(--background);
        box-shadow: 0 0 4px var(--shadow);
        border-radius: 0 0 var(--border-rad) var(--border-rad);
    }
</style>
