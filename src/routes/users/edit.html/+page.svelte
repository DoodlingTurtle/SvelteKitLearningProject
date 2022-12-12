<script>
    import { page } from "$app/stores";
    import { GET } from "$lib/modules/API";

    import { user_modules } from "./UserModules";

    let uid = parseInt($page.url.searchParams.get("uid") || "0");
    let loadeduid = 0;

    let assignedModules = [];
    let userDataPromise = Promise.resolve();

    let currentLogin = "";
    let currentUserName = "";
    let editAccount = false;

    $: if (isNaN(uid)) uid = 0;
    $: if (uid != loadeduid && uid > 0) {
        console.log("change of uid");
        userDataPromise = GET(`/user/${uid}`, { expect: "json" }).then(
            (data) => {
                const ud = data.data || {};
                assignedModules = (ud.rights || "")
                    .split(",")
                    .filter((e) => e.trim() != "");
                currentLogin = ud.login || "";
                currentUserName = ud.profilename || "";
            }
        );

        loadeduid = uid;
    }

    $: availableModules = (() => {
        let ret = {};
        ($user_modules || []).forEach((e, i, a) => (ret[e.id] = e.id));
        return ret;
    })();

    import PageTitle from "$lib/components/PageTitle.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import SwtichList from "$lib/components/SwtichList.svelte";
    import FoldContainer from "$lib/components/FoldContainer.svelte";
    import EditableInput from "../../../lib/components/EditableInput.svelte";
</script>

<div class="page-user-edit">
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
        <FoldContainer className="user-account mb-2 d-block">
            <h2 slot="legend" class="btn">Account</h2>
            <fieldset slot="content">
                <b>Login:</b>
                <EditableInput edit={editAccount} bind:value={currentLogin} placeholder="user login" />

                <b>Username:</b>
                <EditableInput edit={editAccount} bind:value={currentUserName} placeholder="user name" />

                <button class="btn" on:click={() => editAccount = !editAccount}>Edit</button>
            </fieldset>
        </FoldContainer>

        <FoldContainer className="mb-2 d-block">
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

    :global(.user-account [slot="content"]) {
        display: grid;
        grid-gap: .5rem;
        grid-template-columns: 0.5fr 1.5fr;
    }
</style>
