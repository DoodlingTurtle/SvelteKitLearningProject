<script>
    import { getContext, onMount } from "svelte";
    import FoldContainer from "../../../lib/components/FoldContainer.svelte";
    import Loader from "../../../lib/components/Loader.svelte";
    import PasswordChange from "./MyAccountPassword.svelte"

    import { GET } from '../../../lib/modules/API.js';
    import { profileid }  from '../../../lib/modules/Stores.js'

    let context = getContext("settingsfrm");

    let data = {
        displayname: '',
        users_id: {
            login: '',
            email: '',
            pwconfirm: 0
        }
    }

    let loadPromise = Promise.resolve(data);

    onMount(() => {
        console.log("Page on mount");
        loadPromise = GET("/user_profile", {expect: 'json'}, {
            columns: {
                displayname: true,
                users_id: [ 'login', 'email', 'pwconfirm' ]
            }, 
            where: { users_id: $profileid }
        }).then( res => {
            data = res.data[0]
        })
    })

</script>
    
<FoldContainer open={context.myAccountFold} on:toggle={(ev) => {(context.myAccountFold = ev.detail); }} >
    <h2 slot="legend" class="btn {context.myAccountFold ? 'active' : ''}">Settings:</h2>

    <fieldset slot="content" class="frm-myaccount">
        <p class="mt-1 mb-3 mt-sm-1 mb-sm-3" style="grid-area: de"   >
            Here you can change anything in regards to your Account and the App
        </p>
    {#await loadPromise}
        <Loader />
    {:then $_2}
        <b class="                    "  style="grid-area: ll"  >Login:</b>          <span class="               " style="grid-area: lc">{data.users_id.login}</span>
        <b class="mt-3 mt-xs-2 mt-sm-1"  style="grid-area: el"  >E-Mail:</b>         <span class="mt-xs-2 mt-sm-1" style="grid-area: ec">{data.users_id.email}</span>
        <b class="mt-3 mt-xs-2 mt-sm-1"  style="grid-area: nl"  >Profile:</b>        <span class="mt-xs-2 mt-sm-1" style="grid-area: nc">{data.displayname}</span>
    {:catch err}
        {@const $_1 = console.error(err)}
        <span style="color: gray">Failed to get your accunt data.</span>
    {/await}

    <PasswordChange pwconfirm={data.users_id.pwconfirm}/>

    </fieldset>
</FoldContainer>


<style lang="scss">
    @import 'media.sass';

    .frm-myaccount {
        display: grid;
        grid-gap: 0.25rem;
        grid-template-areas: "de" "ll" "lc" "el" "ec" "nl" "nc" "la" "pl" "pc" "rl" "rc" "cp";
        grid-template-columns: 1fr;
        align-items: flex-end;

        button {
            width: 100%;
        }

        @media (min-width: $media-xs) {
            grid-template-areas:
                "de de"
                "ll lc"
                "el ec"
                "nl nc"
                "la la"
                "pl pc"
                "rl rc"
                "cp cp";
            grid-template-columns: 0fr 1fr;
        }

        @media (min-width: $media-sm) {
            grid-template-areas:
                "de de de de de"
                "ll lc lc el ec"
                "nl nc nc nc nc"
                "la la la la la"
                "pl pl pc pc pc"
                "rl rl rc rc rc"
                "cp cp cp cp cp"
                ;

            grid-template-columns: 0fr .5fr 1fr 0fr 1fr;
        }

        @media (min-width: $media-lg) {
            grid-template-areas:
                "de de"
                "ll lc"
                "el ec"
                "nl nc"
                "la la"
                "pl pc"
                "rl rc"
                "cp cp";
            grid-template-columns: 0fr 1fr;
        }

        @media (min-width: $media-xl) {
            grid-template-areas:
                "de de de de de de de de"
                "ll lc .  el ec .  nl nc"
                "la la la la la la la la"
                "pl pl pc pc pc pc pc pc"
                "rl rl rc rc rc rc rc rc"
                "cp cp cp cp cp cp cp cp";

            grid-template-columns: 2fr 1fr 1.5fr 0fr 1fr 1.5fr 0fr 1fr;
        }

        @media (min-width: $media-xxl) {
            grid-template-areas:
                "de de de de de de de de"
                "ll lc .  el ec .  nl nc"
                "la la la la la la la la"
                "pl pl pc pc pc pc cp cp"
                "rl rl rc rc rc rc cp cp";

                grid-template-columns: 0fr 1fr 1.5fr 0fr 1fr 1.5fr 0fr 1fr;
        
        }


        > B { white-space: nowrap; }

    }
</style>
