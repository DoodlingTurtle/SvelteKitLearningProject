<section class="flex_center" data-page="login" in:fade>
    <h1 class="flex_fill">Login</h1>
    <div class="spacer"></div>


    <form on:submit|preventDefault={onSubmit} method="POST" class="login-frm">
        {#if $loginPageErrorMessage}
        <div class="errorMsg">
            {@html htmlentities($loginPageErrorMessage, true)}
        </div>
        {/if}
        <label class="login-frm-label-login" for="login">Login:</label>
        <input class="login-frm-input-login" type="text" bind:value={user} />

        <label class="login-frm-label-password" for="password">Password:</label>
        <input
            class="login-frm-input-password"
            type="password"
            bind:value={pass}
        />

        <input class="btn login-frm-input-button" type="submit" value="Login" />
    </form>

    <div class="spacer"></div>
</section>

<script>
	import {api, username, loggedin, loginPageErrorMessage, user_privilges } from '$lib/stores.js';
    import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
    import ToastMsg from '$lib/modules/ToastMsg';
    import {htmlentities} from '$lib/utils';

    let user = "";
    let pass = "";

    const onSubmit = async () => {
        console.log("submit")
        let response = await fetch(`${$api.url}/login`, {
            method: "post",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: (new URLSearchParams({user, pass})).toString(),
        })

        if(response.status == 200) {
            let jsonRes = await response.json();
            $api = { 
                url: jsonRes['apiurl'],
                token: jsonRes['token']
            };
            $username = jsonRes['displayname'];
            $loggedin = true;
            console.log($user_privilges = jsonRes['modules']);
            goto("/") 

        }
        else {
            const msg = await response.text();
            switch(response.status) {
                case 0:break;
                case 400:
                    ToastMsg.toast("E-Mail and Password do not match", "var(--toast-red)", 2000)
                    break;

                case 423:
                    ToastMsg.toast("This Account has been suspended", "var(--toast-red)", 2000)
                    break;

                default: 
                    console.error(response, msg);
                    ToastMsg.toast(`${response.status}: ${msg}`, "var(--toast-red)", 2000);
            }
        }






    }
</script>

<style lang="scss">
    @import "../../../lib/css/media.sass";
    @import "../../../lib/css/colors.sass";


/*==============================================================================
* Flex - layout
*============================================================================*/
    .flex_center {
      H1 {
        flex-grow: 0;
      }

      .spacer {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 100%;
      }

      .errorMsg {
        //padding-inline: 2rem;
        text-align: left;
        color: red;
        font-weight: bold;

        grid-area: error;

        margin-bottom: 1.5rem;
      }
    }

/*==============================================================================
* Color Stuff
*============================================================================*/
    .login-frm-label-login,
    .login-frm-label-password {
        padding-right: 0.25rem;
        padding-top: 0.25rem;
    }

    /** Form Background */
    .login-frm::before {
        content: "";

        background-color: white;
        grid-area: llogin / llogin / submit / submit;
        width: calc(100% + 2rem);
        height: calc(100% + 2rem);
        margin-left: -1rem;
        margin-top: -1rem;
        border-radius: var(--border-rad);
        box-shadow: 0 0 0.25rem 0 var(--shadow);
    }

/*==============================================================================
* Layout Stuff
*============================================================================*/
    .login-frm {
        display: grid;
        width: 100%;

        grid-template-columns: 0.125fr 1fr 0.125fr;
        grid-template-rows: 0.5fr repeat(6, 0fr) 1fr;

        grid-template-areas:
            ". .      ."
            ". error ."
            ". llogin ."
            ". ilogin ."
            ". lpass  ."
            ". ipass  ."
            ". submit ."
            ". .      .";
    }

    .login-frm-label-login {
        grid-area: llogin;
    }
    .login-frm-input-login {
        grid-area: ilogin;
    }

    .login-frm-label-password {
        grid-area: lpass;
    }
    .login-frm-input-password {
        grid-area: ipass;
    }

    .login-frm-input-button {
        grid-area: submit;
        margin-top: 0.5rem;
    }

    .login-frm-input-password,
    .login-frm-input-login {
        margin-bottom: 0.5rem;
    }

    @media (min-width: $media-sm) {
        .login-frm {
            grid-template-columns: 0.5fr 0.25fr 1fr 0.5fr;
            grid-template-rows: 0.5fr repeat(4, 0fr) 1fr;

            grid-template-areas:
                ". .      .      ."
                ". error  error  ."
                ". llogin ilogin ."
                ". lpass  ipass  ."
                ". submit submit ."
                ". .      .      .";
        }

        .login-frm-label-password,
        .login-frm-label-login {
            text-align: right;
        }
    }
</style>
