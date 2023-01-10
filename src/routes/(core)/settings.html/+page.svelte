<script>
    import PageTitle from '$lib/components/PageTitle.svelte';
    import Loader from "$lib/components/Loader.svelte";

    import MyAccount from './MyAccount.svelte';
    import Privileges from './Privileges.svelte';
    import Sessions from './Sessions.svelte';
    
    import { setContext } from 'svelte';

    //=========================================================================
    // Create Context (shared with all components) 
    //=========================================================================
    let context = setContext("settingsfrm", {
        myAccountFold: true, 
        modulesFold: true, 
        sessionsFold: true, 
    })

</script>

<div class="page-settings">

    <PageTitle alternateContainer="#ApplicationTitleBar" scrollListener="#AppContainer">Your account</PageTitle>

    <div class="frm">
        <span style="grid-area: ma"><MyAccount /></span>
        <span style="grid-area: mo"><Privileges/></span>
        <span style="grid-area: se"><Sessions  /></span>
    </div>

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
