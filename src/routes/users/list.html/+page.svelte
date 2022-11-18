<script lang="ts">
    import PageTitle from "$lib/components/PageTitle.svelte";
    import BtnDelete from "$lib/components/BtnDelete.svelte";

    import { fade, slide } from "svelte/transition";
    import { flip } from "svelte/animate"
    import { DELETE, GET } from '$lib/api'

    import { htmlentities } from '$lib/utils';
    import Loader from "$lib/components/Loader.svelte";
    import { onMount } from "svelte";

    interface ListEntry {
        id:number,
        login:string,
        email:string,
        profilename:string,

        rights: string,

        created: string,
        updated: string
    }

    let userList :ListEntry[] = [];

    let actionPromise = Promise.resolve();

    onMount(() => {
        actionPromise = GET("/users", {expect: 'json'}).then( res => userList = res.data );
    })

    const onDelete = (userID: number) => {
        actionPromise = DELETE(`/user/${userID}`).then( () => {
            actionPromise = GET("/users", {expect: 'json'}).then( res => userList = res.data );
        })
    }
</script>


<div class="page-users-list" in:fade>
    <PageTitle alternateContainer="#ApplicationTitleBar" scrollListener="#AppContainer">Userlist</PageTitle>

    <section class="users-list">

    {#await actionPromise}
        <Loader />
    {:catch err}
        <article class="errormsg" in:slide>
            {err}
        </article>
    {/await}

    {#each userList as entry (entry.id)}
        {@const htmlrights=htmlentities(entry.rights.replace(/,/g, "\n"), true)}
        <article class="entry mb-2" animate:flip>

            <b style="grid-area: hid____">ID:</b>
            <b style="grid-area: hlogin_">Login:</b>
            <b style="grid-area: hmail__">E-Mail:</b>
            <b style="grid-area: hprofil">Profile:</b>
            <b style="grid-area: hrights">Rights:</b>
            <b style="grid-area: hmeta__">Meta:</b>

			<div style="grid-area: id_____"> {entry.id} </div>
			<div style="grid-area: login__"> {entry.login} </div>
			<div style="grid-area: mail___"> {entry.email} </div>
			<div style="grid-area: profile"> {entry.profilename} </div>
			<div style="grid-area: rights_"> {@html htmlrights} </div>
			<div style="grid-area: meta___"> 
				{entry.created}  <br />
				{entry.updated}
			</div>

            <div style="grid-area: options"> 
                <BtnDelete 
                    confirmMsg="Removing this user can not be undone. Continue?" 
                    labelYes = "Yes"
                    labelNo = "No"
                    on:click={() => onDelete(entry.id)}
                />
                <a 
                    href={`./edit.html?uid=${entry.id}`}
                    class="btn listoption"
                >
                    <li class="fa fa-folder">
                </a>
            </div>

        </article>
    {/each}
    </section>
</div>

<style lang="scss">
    @import "media.sass";

    article.errormsg {
        color: red;
    } 

    .users-list article {
        grid-gap: .5rem;
        grid-template-columns: 0fr 1fr 1fr 0fr;

        padding: 1rem;
        border-radius: var(--border-rad);

        grid-template-areas: 
            "hid____ id_____ id_____ options"
            "hlogin_ login__ login__ options"
            "hmail__ mail___ mail___ options"
            "hprofil profile profile options"
            "hrights hrights hmeta__ hmeta__"
            "rights_ rights_ meta___ meta___"
        ;
        @media(min-width: $media-sm) {
            grid-template-columns: 0fr 1fr 1fr 1fr 0fr;
            grid-template-areas: 
                "hid____ id_____ hrights hmeta__ options"
                "hlogin_ login__ rights_ meta___ options"
                "hmail__ mail___ rights_ meta___ options"
                "hprofil profile rights_ meta___ options"
            ;
        }

        @media(min-width: $media-lg) {
            grid-template-columns: 6ch .5fr 1.5fr 1fr 1fr; 
            grid-template-areas: 
                "hid____ hlogin_ hmail__ hprofil hrights hmeta__ .      "
                "id_____ login__ mail___ profile rights_ meta___ options"
            ;
        }
    }

    .users-list article.entry {
        display: grid;
        background-color: var(--background);
    }
    
    B {
        display: inline-block;
        white-space: nowrap;
    }

</style>