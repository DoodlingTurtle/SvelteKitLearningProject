<script>
    import { page } from "$app/stores";
    import { GET, PATCH } from "$lib/modules/API";
    import { user_modules } from "./UserModules";
    import debug from "$lib/modules/Debug";
    import { toast } from '$lib/modules/ToastMsg'

    //====================================================================================
    // Properties
    //====================================================================================
    let uid = parseInt($page.url.searchParams.get("uid") || "0");
    let loadeduid = 0;

    let assignedModules = []; let originalModules = [];

    let userDataPromise = Promise.resolve();

    let currentLogin = "";
    let currentUserName = "";
    let currentUserEmail = "";

    let modulesChanged = false;
    let editAccount = false;

    //====================================================================================
    // Reactive State
    //====================================================================================
    $: if (isNaN(uid)) uid = 0;
    $: if (uid != loadeduid && uid > 0) {
        debug.log("change of uid", uid);
        userDataPromise = GET(`/user/${uid}`, { expect: "json" }).then(
            (data) => {
                const ud = data.data || {};
                assignedModules = (ud.rights || "")
                    .split(",")
                    .filter((e) => e.trim() != "");

                originalModules = [ ...assignedModules ];

                currentLogin = ud.login || "";
                currentUserName = ud.profilename || "";
                currentUserEmail = ud.email || "";
            }
        );

        loadeduid = uid;
    }

    $: availableModules = (() => {
        let ret = {};
        ($user_modules || []).forEach((e, i, a) => (ret[e.id] = e.id));
        return ret;
    })();

    //====================================================================================
    // Event Handlers
    //====================================================================================
    const onReassignModules = async () => {

        PATCH(
            `/user/${uid}/modules`, 
            { 'modules': assignedModules },
            { headers: { "content-type": 'application/json' } ,expect: "json"}
        )
            .then((ret) => {
                originalModules = [ ...assignedModules ]
                modulesChanged = false;
                toast(
                    `changes saved`, 
                    'var(--toast-green)', 
                    2000
                );
            })
            .catch((e) => {
                if(e.status != 403) {
                    toast(
                        `Server error: ${e.data || e.message || 'see console'}`, 
                        'var(--toast-red)', 
                        5000
                    );
                }
            })
    }



    //====================================================================================
    // Components
    //====================================================================================
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
        <div class="main-layout">
            <FoldContainer className="user-account mb-2 d-block">
                <h2 slot="legend" class="btn">Account</h2>
                <fieldset slot="content">
                    <b      style="grid-area: lll" class="mt-2">Login:</b> 
                    <span   style="grid-area: llv" class="mt-2 text-only">{currentLogin}</span>


                    <b      style="grid-area: prl" class="mt-2">Username:</b>
                    <EditableInput 
                            style="grid-area: prv" className="mt-2" edit={editAccount} bind:value={currentUserName} placeholder="user name" />
                    <button style="grid-area: prb" class="mb-2 mb-sm-0 btn" on:click={() => editAccount = !editAccount}>{editAccount ? 'save' : 'edit'}</button>


                    <b      style="grid-area: eml" class="mt-4 mt-xs-2"          >E-Mail:</b>
                    <span   style="grid-area: emv" class="mt-0 mt-xs-2 text-only">{currentUserEmail}</span>
                    <button style="grid-area: emb" class="mb-2 mb-sm-0 btn"      >request change</button>


                    <button style="grid-area: pcb" class="btn mt-4">request password change</button>
                </fieldset>
            </FoldContainer>

            <FoldContainer className="mb-2 d-block">
                <h2 slot="legend" class="btn">Modules:</h2>
                <fieldset slot="content">
                    <SwtichList
                        height="16"
                        source={availableModules}
                        bind:value={assignedModules}
                        on:change={() => {debug.log('modules changed'); modulesChanged = true}}
                    />

                    {#if modulesChanged}
                    <div class="two_button_row">
                        <button class="btn" on:click={onReassignModules}>save</button>
                        <button class="btn" on:click={() => { assignedModules = [ ...originalModules ]; modulesChanged = false; }}>reset</button>
                    </div>
                    {/if}
                </fieldset>
            </FoldContainer>
        </div>
    {:catch err}
        {@const t1 = console.log(err)}
        Something went wrong
    {/await}
</div>

<style lang="scss">
    @import "colors.sass";
    @import "media.sass";

    .main-layout {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: .5rem;

        @media (min-width: $media-xl) {
            grid-template-columns: 1.15fr 0.85fr;
        }
    }


    .two_button_row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: .5rem;
    }

    SPAN.text-only {
        padding-inline: .5em;
    }

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

        grid-template: 
            "lll llv"
            "prl prv" 
            "prb prb"

            "eml eml" 
            "emv emv"
            "emb emb"
            
            "pcb pcb";

        grid-template-columns: .25fr 1.5fr ;
        @media(min-width: $media-xs) {
            grid-template: 
                "lll llv"
                "prl prv"
                "prb prb"
                "eml emv"
                "emb emb"
                
                "pcb pcb";

            grid-template-columns: .25fr 1.5fr ;
        }

        @media(min-width: $media-sm) {

            grid-template: 
                "lll llv llv"
                "prl prv prb"
                "eml emv emb"
                
                "pcb pcb pcb";

            grid-template-columns: .25fr 2fr .75fr ;
        }
    }
</style>
