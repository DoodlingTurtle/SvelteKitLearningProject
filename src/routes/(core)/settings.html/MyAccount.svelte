
<script>
    import { getContext } from "svelte";
    import FoldContainer from "../../../lib/components/FoldContainer.svelte";
    import { slide } from "svelte/transition";

    import { GET, POST, PATCH, DELETE } from '../../../lib/modules/API.js';
    import { profileid }  from '../../../lib/modules/Stores.js'
    import { empty } from '../../../lib/modules/Utils.js';
    import { toast } from '../../../lib/modules/ToastMsg.js';

    let context = getContext("settingsfrm");

    let sPasswordError = "";
    let sPasswordMessage = "";

    let data = {
        displayname: '',
        users_id: {
            login: '',
            email: '',
        }
    }

    GET("/user_profile", {expect: 'json'}, {
        columns: {
            displayname: true,
            users_id: [ 'login', 'email', 'pwconfirm' ]
        }, 
        where: { users_id: $profileid }
    }).then( res => {
        data = res.data[0]
    })

    $: sPasswordMessage = context.pwConfirm 
        ? "To finish the change, please enter the Code from the E-Mail we send you."
        : "";

    $: bPasswordError = sPasswordError.trim() != "";
    $: bPasswordMessage = bPasswordError || sPasswordMessage.trim() != "";
    $: if(bPasswordError) sPasswordMessage = sPasswordError;

    const onConfirm = () => {
        if(empty(context.pwConfirmOldPW)) {
            toast("please fill in the old password", 'var(--toast-red)', 4000)
            return;
        }

        if(empty(context.pwConfirmCode)) {
            toast("please enter the confirm code", 'var(--toast-red)', 4000)
            return;
        }

        PATCH("/passwordchange", {oldpw: context.pwConfirmOldPW, code: context.pwConfirmCode })
            .then( res => {
                data.pwchange=0;
                context.pwConfirmOldPW="";
                context.pwConfirmCode="";
            } )
            .catch( err => {
                toast("failed to confirm password change " + err.data, 'var(--toast-red)', 6000)
                console.error(err);
            } )
    }

    const onCancel = () => {
        DELETE("/passwordchange").then(res => {
            switch(res.status) {
                default: 
                    console.warn("unexpected response status: ", res);
                case 205:  
                    context.pwConfirm = false;
                    data.pwchange=0
                    context.pwConfirmOldPW="";
                    context.pwConfirmCode="";
            }
        })
        .catch( err => {
            toast("failed to cancel password change " + err.data, 'var(--toast-red)', 6000)
            console.error(err);
        } )
    }

    const onclick = () => {
        let p1 = context.pass;
        let p2 = context.passRep;

        sPasswordError = "";

        if(p1.length != p1.trim().length) {
            sPasswordError = "password cant have whitepaces at the start or end";
            return;
        }

        if(p1 != p2) {
            sPasswordError = "Password and its Repeat do not match";
            return;
        }

        POST("/passwordchange", {'pass': p1}, {expect: 'json'})
            .then(res => {
                context.pass = "";
                context.passRep = "";
                data.pwchange = "1";
            }).catch( err => toast(`password change request failed: ${err.data}`, 'var(--toast-red)', 5000) )
    }

</script>
    
<FoldContainer open={context.myAccountFold} on:toggle={(ev) => {(context.myAccountFold = ev.detail); }} >
    <h2 slot="legend" class="btn {context.myAccountFold ? 'active' : ''}">Settings:</h2>

    <fieldset slot="content" class="frm-myaccount">
        <p class="mt-1 mb-3 mt-sm-1 mb-sm-3" style="grid-area: de"   >
            Here you can change anything in regards to your Account and the App
        </p>
        <b class="                    "  style="grid-area: ll"  >Login:</b>          <span class="               " style="grid-area: lc">{data.users_id.login}</span>
        <b class="mt-3 mt-xs-2 mt-sm-1"  style="grid-area: el"  >E-Mail:</b>         <span class="mt-xs-2 mt-sm-1" style="grid-area: ec">{data.users_id.email}</span>
        <b class="mt-3 mt-xs-2 mt-sm-1"  style="grid-area: nl"  >Profile:</b>        <span class="mt-xs-2 mt-sm-1" style="grid-area: nc">{data.displayname}</span>

        {#if bPasswordMessage}
            <span class="mt-4 mt-sm-2" style="grid-area: la">
                <b transition:slide style:color={bPasswordError ? 'red' : 'green'} style="display: block" class="mb-4 mt-4">{sPasswordMessage}</b>
            </span>
        {/if}

        {#if context.pwConfirm} 
            <b class="mt-2" style="grid-area: pl">Old Password:</b>
            <span class="mt-sm-2" style="grid-area: pc"><input type="password" bind:value={context.pwConfirmOldPW}/></span>
            <b class="mt-2" style="grid-area: rl">Conf. Code:</b>
            <span class="mt-sm-2" style="grid-area: rc"><input type="text" bind:value={context.pwConfirmCode}/></span>

            <span class="mt-2      mt-sm-1"  style="grid-area: cp">
                <button class="btn" on:click={onConfirm} >confirm</button>
                <button class="btn" on:click={onCancel} >cancel change</button>
            </span>
        {:else}
            <b class="mt-4         mt-sm-2" style="grid-area: pl"
                style:color={bPasswordError ? 'red' : ''} >Password:</b>       
                <span class="mt-xs-4 mt-sm-2" style="grid-area: pc"><input type="password" bind:value={context.pass} /></span>
            <b class="mt-2         mt-sm-1" style="grid-area: rl" 
                style:color={bPasswordError ? 'red' : ''} >Password Repeat:</b>
                <span class="mt-xs-2 mt-sm-1" style="grid-area: rc"><input type="password" bind:value={context.passRep} /></span>

            <span class="mt-2      mt-sm-1" style="grid-area: cp" ><button class="btn" on:click={onclick} >change password</button></span>
        {/if}
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
