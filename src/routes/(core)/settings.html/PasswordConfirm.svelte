<script>

    import { createEventDispatcher } from 'svelte'
    import { PATCH, DELETE } from '../../../lib/modules/API.js'; 
    import { toast } from '../../../lib/modules/ToastMsg.js';
    import { empty } from '../../../lib/modules/Utils.js';

    let on = createEventDispatcher();

    let pwconfirmOldPW = "";
    let pwconfirmCode = "";

    const onCancel = () => {
        DELETE("/user_passwordchange").then(res => {
            switch(res.status) {
                default: 
                    console.warn("unexpected response status: ", res);
                case 204:
                case 205:  
                    toast("Password change canceled", 'var(--toast-gray)', 3000)
                    on('complete');
            }
        })
        .catch( err => {
            toast("failed to cancel password change " + err.data, 'var(--toast-red)', 6000)
            console.error(err);
        } )
    }

    const onConfirm = () => {
        if(empty(pwconfirmOldPW)) {
            toast("please fill in the old password", 'var(--toast-red)', 4000)
            return;
        }

        if(empty(pwconfirmCode)) {
            toast("please enter the confirm code", 'var(--toast-red)', 4000)
            return;
        }

        PATCH("/passwordchange", {oldpw: pwconfirmOldPW, code: pwconfirmCode })
            .then( () => {
                toast("New Password set", 'var(--toast-green)', 3000)
                on('complete');
            } )
            .catch( err => {
                toast("failed to confirm password change " + err.data, 'var(--toast-red)', 6000)
                console.error(err);
            } )
    }
</script>

<span class="mt-4 mt-sm-2" style="grid-area: la">
    <b style="display: block" class="mb-4 mt-4">To finish the change, please enter the Code from the E-Mail we send you.</b>
</span>

<b class="mt-2" style="grid-area: pl">Old Password:</b>
<span class="mt-sm-2" style="grid-area: pc"><input type="password" bind:value={pwconfirmOldPW}/></span>
<b class="mt-2" style="grid-area: rl">Conf. Code:</b>
<span class="mt-sm-2" style="grid-area: rc"><input type="text" bind:value={pwconfirmCode}/></span>

<span class="mt-2      mt-sm-1"  style="grid-area: cp">
    <button class="btn" on:click={onConfirm} >confirm</button>
    <button class="btn" on:click={onCancel} >cancel change</button>
</span>
