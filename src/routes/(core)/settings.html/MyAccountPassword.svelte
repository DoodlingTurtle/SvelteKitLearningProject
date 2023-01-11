<script>
    import PasswordChange from './PasswordChange.svelte'
    import PasswordConfirm from './PasswordConfirm.svelte'

    import { getContext } from "svelte";

    export let pwconfirm = 0;

    let sPasswordError = "";
    let sPasswordMessage = "";

</script>


{#if pwconfirm} 
    <PasswordConfirm on:complete={() => { console.log("PW Change finished"); pwconfirm = 0 }} />
{:else}
    <PasswordChange on:complete={() => { console.log("PW Change requested"); pwconfirm = 1 }} />
{/if}
