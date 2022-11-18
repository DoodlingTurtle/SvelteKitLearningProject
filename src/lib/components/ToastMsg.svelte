<script>
    import ToastMsg from "../modules/ToastMsg";
    import { fade, fly } from 'svelte/transition';

    let visible = false;
    let backgroundColor = 'gray';
    let msg = "Toast Msg component"

    ToastMsg.addEventListener("show", (ev) => {
        const toast = ev.detail;
        msg = toast.msg;
        backgroundColor = toast.color;
        visible = true;
    });
    ToastMsg.addEventListener("hide", () => (visible = false));

</script>


{#if visible}
<div 
    style="background-color: {backgroundColor};" 
    class="visible"
    in:fly="{{y: -200, duration: 500}}"
    out:fade
>
    {msg}
</div>
{/if}

<style lang="sass">
    @import '../css/media.sass'
    DIV 
        position: fixed
        left: 0px
        max-width: calc(100vw - 3rem)
        padding: .2rem 1rem
        margin: .5rem
        margin-left: 50vw
        transform: translate(-50%, 0%)
        border-radius: var(--border-rad)
        text-align: center
        top: 0vh 
        min-height: 1cm
        line-height: 1cm
        color: white
        overflow: hidden 
        z-index: 100000 
        
        @media(max-width: $media-md)
            width: calc(100vw - 3rem)
            margin: .5rem
            transform: translate(0%, 0%) !important

</style>
