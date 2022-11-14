<FoldContainer open={context.sessionsFold} on:toggle={(ev) => {(context.sessionsFold = ev.detail); }} >
    <h2 slot="legend" class="btn {context.sessionsFold ? 'active' : ''}">Sessions:</h2>
    <fieldset slot="content">
        <p class="mt-1 mb-0 mt-sm-1 mb-sm-3">Here are all active Sessions connected to your Account.</p>
        
        {#await sessionsPromise}
            <Loader />
        {:then data}
            {#each sessions as session (session.id)}
                <article class="mb-4" animate:flip={{duration: 500}}>
                    <b style="grid-area: sil" class="mb-2">{formatDateTime(session.ctime)}</b>

                    <b style="grid-area: ual">User-Agent:</b>
                    <p style="grid-area: uac">{session.data.agent}</p>

                    <b style="grid-area: ipl">IP:</b>
                    <p style="grid-area: ipc">{session.data.ip}</p>

                    <b style="grid-area: orl">Origin:</b>
                    <p style="grid-area: orc">{session.data.origin}</p>

                    <div style="grid-area: opt" >
                        <a href={"#"} class="btn listoption" on:click|preventDefault={() => dropSession(session.id)}><li class="fa fa-trash"/></a>
                    </div>
                </article>
            {/each}
        {:catch error}
            <span style="color: gray">Failed to get your current Session-List: Check if you are offline.</span>
        {/await}
    </fieldset>
</FoldContainer>

<script lang="ts">
    import { getContext } from "svelte";
    import { flip } from 'svelte/animate';

    import { GET, DELETE } from "$lib/modules/API.js";
    import FoldContainer from "$lib/components/FoldContainer.svelte";
    import Loader from "$lib/components/Loader.svelte";

    import { formatDateTime } from "$lib/utils";

    interface ContextObj  {
        sessionsFold: boolean
    }

    let context:ContextObj = getContext("settingsfrm");
    let sessions:any[]= [];
    export const data ={};

    let sessionsPromise = GET("/sessions", {expect: 'json'})
        .then( data => {
            sessions = data.data
            return Promise.resolve();
        });

    async function dropSession(sessID:string) {
        await DELETE(`/session/${sessID}`);
        sessions = sessions.filter((s) => s.id != sessID);
    }




</script>


<style lang="scss">
    @import 'media.sass';

    ARTICLE {
        background-color: rgba(0, 0, 0, 0.1);
        padding: var(--body-margin);
        border-radius: var(--border-rad);

        display: grid;
        grid-gap: .5rem;

        grid-template-columns: 0fr 1fr 0fr;
        grid-template-areas: 
            "sil sil opt" 
            "ual ual ual" 
            "uac uac uac"
            "ipl ipc ipc"
            "orl orc orc"
        ;

        @media(min-width: $media-sm)  {
            grid-template-areas: 
                "sil sil opt"
                "ual uac opt"
                "ipl ipc opt"
                "orl orc opt"
            ;
        }

        @media(min-width: $media-lg) {
            grid-template-columns: 0fr 1fr 0fr 0fr 1fr 0fr;
            grid-template-areas: 
                "sil sil sil sil sil opt"
                "ual uac uac uac uac opt"
                "ipl ipc .   orl orc opt"
            ;
        }

        B { white-space: nowrap; }
        P { margin: 0px; margin-left: .5rem; }

    }
</style>