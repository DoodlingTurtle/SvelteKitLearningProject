<script>
    import { menuOpen, user_modules } from "$lib/modules/Stores";
    import NavToggle from "$lib/components/NavToggle.svelte";

    const leave = () => ($menuOpen = false);

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<nav
    id="mainNavi"
    class:open={$menuOpen}
    on:click={leave}
    on:mouseleave={leave}
>
    <NavToggle cssClass="nav-toggle" />
    <ul>
        <li><a href="/">Home</a></li>
        <li>
            <b>Projects:</b>
            <ul>
                <li><a href={"#"}>OctoJuwels</a></li>
                <li><a href={"#"}>WASteroids</a></li>
            </ul>
        </li>
        <li>
            <a
                href="https://www.youtube.com/channel/UChouHHSWvqkihVDC-Cim41g"
                target="_blank"
                rel="noreferrer">YouTube</a
            >
        </li>
    </ul>

    <ul class="mainNaviBottom">
        {#if $user_modules['core']||false}
        <li><a href="/settings.html"><i class="fa fa-gear" />&nbsp;Settings</a></li>
        {/if}
    </ul>
</nav>

<style lang="sass">
    #mainNavi
        z-index: 99999
        :global(.nav-toggle)
            position: fixed
            top: 2mm
            right: 2mm

</style>
