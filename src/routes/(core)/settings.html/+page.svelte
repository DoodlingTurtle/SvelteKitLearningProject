<script>
    // @ts-nocheck
    import { GET } from "$lib/modules/API.js";

    import PageTitle from '$lib/components/PageTitle.svelte';
    import Loader from "$lib/components/Loader.svelte";
    import FlowyGrid from '$lib/components/FlowyGrid.svelte';

    import MyAccount from './MyAccount.svelte';
    import Privileges from './Privileges.svelte';
    import Sessions from './Sessions.svelte';
    
    import { setContext } from 'svelte';
    import { fade } from 'svelte/transition';
    
    //=========================================================================
    // Fetch Data for the Form
    //=========================================================================
    let fetchPromise = GET("/account", { expect: "json" }).then((res) => Promise.resolve(res.data));

    //=========================================================================
    // Create Context (shared with all components) 
    // Required, since layout changes cause the form to be destroyed and 
    // Rebuild (The only way I know how to trigger the animations)
    //=========================================================================
    let context = setContext("settingsfrm", {
        myAccountFold: true, 
        modulesFold: true, 
        sessionsFold: true, 
        pass: "", 
        passRep: ""
    })

    function onPWChange(ev) {
        console.log("myaccount on click");
    }


</script>


<div class="page-settings" transition:fade>

    <PageTitle alternateContainer="#ApplicationTitleBar" scrollListener="#AppContainer">Your account</PageTitle>
    
    {#await fetchPromise}
        <Loader />
    {:then data}
        <FlowyGrid 
            layouts = {{
                /* Default Layout (Mobile first) */
                ""                  :    "grid-template-areas: 'ma' 'mo' 'se' ; grid-template-columns: 1fr",
        
                /* Layout changes if the screens min with is 992px */
                "(min-width: 992px)":    "grid-template-areas: 'ma mo' 'se se'; grid-template-columns: 1fr 1fr;",

                /* Layout layout changes if the screens min with is 1200 */        
                "(min-width: 1200px)":   "grid-template-areas: 'ma mo' 'se mo'; grid-template-columns: 2fr 1fr; grid-template-rows: 0fr 1fr",
            }}
        
            components={[
                {component: MyAccount,   style: "grid-area: ma", props: {'onclick': onPWChange }},
                {component: Privileges,  style: "grid-area: mo"  },
                {component: Sessions,    style: "grid-area: se"  },
            ]} 
            
            props={{data}} 
        
        />
    
    {:catch error}
        Error while loading, you may need to log out and in again
    {/await}
</div>

<style lang="scss">
    @import "colors.sass";
    @import "media.sass";

    .page-settings :global(.flowygrid-layout) {
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