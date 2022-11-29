<script>
    // @ts-nocheck
    import { GET } from "$lib/modules/API";

    import PageTitle from '$lib/components/PageTitle.svelte';
    import Loader from "$lib/components/Loader.svelte";

    import MyAccount from './MyAccount.svelte';
    import Privileges from './Privileges.svelte';
    import Sessions from './Sessions.svelte';
    
    import { setContext } from 'svelte';
    import { fade } from 'svelte/transition';
    
    //=========================================================================
    // Fetch Data for the Form
    //=========================================================================
    let fetchPromise = GET("/account", { expect: "json" }).then( res => res.data );

    //=========================================================================
    // Create Context (shared with all components) 
    //=========================================================================
    let context = setContext("settingsfrm", {
        myAccountFold: true, 
        pwConfirm: false,
        pwConfirmCode: "",


        modulesFold: true, 
        sessionsFold: true, 
        pass: "", 
        passRep: "",
    })


</script>


<div class="page-settings" in:fade>

    <PageTitle alternateContainer="#ApplicationTitleBar" scrollListener="#AppContainer">Your account</PageTitle>
    
    {#await fetchPromise}
        <Loader />
    {:then data}

        <div class="frm">
            <span style="grid-area: ma"><MyAccount  {data} /></span>
            <span style="grid-area: mo"><Privileges {data} /></span>
            <span style="grid-area: se"><Sessions   {data} /></span>
        </div>

    {:catch error}
        Error while loading, you may need to log out and in again
    {/await}
</div>

<style lang="scss">
    @import "colors.sass";
    @import "media.sass";

    DIV.frm {
        display: grid;
        grid-template-areas: 'ma' 'mo' 'se' ; 
        grid-template-columns: 1fr;

        @media(min-width: 992px) {
            grid-template-areas: 'ma mo' 'se se'; 
            grid-template-columns: 1fr 1fr;
        }

        @media(min-width: 1200px) {
            grid-template-areas: 'ma mo' 'se mo'; 
            grid-template-columns: 2fr 1fr; 
            grid-template-rows: 0fr 1fr;
        }
    }

    .page-settings DIV.frm {
        display: grid;
        grid-gap: .5rem;


        :global([slot=legend]) {
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
        
        :global([slot=legend].active) {
            border-radius: var(--border-rad) var(--border-rad) 0 0;
        }

        :global([slot=content]) {
            border: none;
            background-color: var(--background);
            box-shadow: 0 0 4px var(--shadow);
            border-radius: 0 0 var(--border-rad) var(--border-rad);
        }
    }

</style>