
<script>
    import { getContext } from "svelte";
    import FoldContainer from "$lib/components/FoldContainer.svelte";
    
    export let data = {}
    export let onclick=() => {}

    let context = getContext("settingsfrm");

</script>
    
<FoldContainer open={context.myAccountFold} on:toggle={(ev) => {(context.myAccountFold = ev.detail); }} >
    <h2 slot="legend" class="btn {context.myAccountFold ? 'active' : ''}">MyAccount:</h2>

    <fieldset slot="content" class="frm-myaccount">
        <p class="mt-1 mb-3 mt-sm-1 mb-sm-3"    >Here you can change anything in regards to your Account and the App</p>
        <b class="                      ">Login:</b>          <span class="                 ">{data.login}</span>
        <b class="mt-3 mt-xs-2 mt-sm-1  ">E-Mail:</b>         <span class="mt-xs-2 mt-sm-1  ">{data["email"]}</span>
        <b class="mt-3 mt-xs-2 mt-sm-1  ">Profile:</b>        <span class="mt-xs-2 mt-sm-1  ">{data["profilename"]}</span>
        <b class="mt-4         mt-sm-2  ">Password:</b>       <span class="mt-xs-4 mt-sm-2  "><input type="password" bind:value={context.pass} /></span>
        <b class="mt-2         mt-sm-1  ">Password Repeat:</b><span class="mt-xs-2 mt-sm-1  "><input type="password" bind:value={context.passRep} /></span>
        <span class="mt-2      mt-sm-1  "><button class="btn" on:click={onclick} >change password</button></span>
    </fieldset>
</FoldContainer>


<style lang="scss">
    @import 'media.sass';

    .frm-myaccount {
        display: grid;
        grid-gap: 0.25rem;
        grid-template-areas: "de" "ll" "lc" "el" "ec" "nl" "nc" "pl" "pc" "rl" "rc" "cp";
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
                "pl pc"
                "rl rc"
                "cp cp";
            grid-template-columns: 0fr 1fr;
        }

        @media (min-width: $media-xl) {
            grid-template-areas:
                "de de de de de de de de"
                "ll lc .  el ec .  nl nc"
                "pl pl pc pc pc pc pc pc"
                "rl rl rc rc rc rc rc rc"
                "cp cp cp cp cp cp cp cp";

            grid-template-columns: 2fr 1fr 1.5fr 0fr 1fr 1.5fr 0fr 1fr;
        }

        @media (min-width: $media-xxl) {
            grid-template-areas:
                "de de de de de de de de"
                "ll lc .  el ec .  nl nc"
                "pl pl pc pc pc pc .  . "
                "rl rl rc rc rc rc cp cp";

                grid-template-columns: 0fr 1fr 1.5fr 0fr 1fr 1.5fr 0fr 1fr;
        
        }


        > B { white-space: nowrap; }

        :nth-child(1) { grid-area: de;}
        :nth-child(2) { grid-area: ll;}
        :nth-child(3) { grid-area: lc;}
        :nth-child(4) { grid-area: el;}
        :nth-child(5) { grid-area: ec;}
        :nth-child(6) { grid-area: nl;}
        :nth-child(7) { grid-area: nc;}
        :nth-child(8) { grid-area: pl;}
        :nth-child(9) { grid-area: pc;}
        :nth-child(10){ grid-area: rl;}
        :nth-child(11){ grid-area: rc;}
        :nth-child(12){ grid-area: cp;}
    }
</style>