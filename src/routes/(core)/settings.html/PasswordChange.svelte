<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition"
    import { POST } from '../../../lib/modules/API.js';
    import { toast } from '../../../lib/modules/ToastMsg.js';
    import { empty } from '../../../lib/modules/Utils.js';

    export let hasError = false;
    let sPasswordError = '';
    $: hasError = !empty(sPasswordError);

    let pass = '';
    let passRep = '';

    let on = createEventDispatcher();

    const onclick = () => {

        sPasswordError = "";

        if(empty(pass, true)) {
            sPasswordError = "Please enter a password";
            return;
        }

        if(pass.length != pass.trim().length) {
            sPasswordError = "Password cant have whitepaces at the start or end";
            return;
        }

        if(pass != passRep) {
            sPasswordError = "Password and its Repeat do not match";
            return;
        }
        
        if(empty(sPasswordError))
            POST("/passwordchange", { pass }, {expect: 'json'})
                .then(res => {
                    pass = "";
                    passRep = "";
                    on("complete");
                }).catch( err => toast(`password change request failed: ${err.data}`, 'var(--toast-red)', 5000) )
    }
</script>

{#if hasError}
    <span class="mt-4 mt-sm-2" style="grid-area: la">
        <b transition:slide style="color: red; display: block" class="mb-4 mt-4">{sPasswordError}</b>
    </span>
{/if}

<b class="mt-4         mt-sm-2" style="grid-area: pl"
    style:color={hasError ? 'red' : ''} >Password:</b>       
    <span class="mt-xs-4 mt-sm-2" style="grid-area: pc"><input type="password" bind:value={pass} /></span>
<b class="mt-2         mt-sm-1" style="grid-area: rl" 
    style:color={hasError ? 'red' : ''} >Password Repeat:</b>
    <span class="mt-xs-2 mt-sm-1" style="grid-area: rc"><input type="password" bind:value={passRep} /></span>

<span class="mt-2      mt-sm-1" style="grid-area: cp" ><button class="btn" on:click={onclick} >change password</button></span>
