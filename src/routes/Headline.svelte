<script>
    import BtnLogout from '$lib/components/BtnLogout.svelte';
    import { loggedin, menuOpen } from '$lib/modules/Stores';
    import NavToggle from '$lib/components/NavToggle.svelte';

    import '$lib/vendor/font-awesome/css/all.min.css';
</script>

<header id="mainHeadline">
    {#if !$menuOpen}
        <NavToggle cssClass="nav-toggle btn" />
    {:else}
        <div class="btnStandin">&nbsp;</div>
    {/if}

    <span id="ApplicationTitleBar"></span>

    {#if $loggedin}
        <BtnLogout cssClass="float-end" />
    {:else}
        <a href="/login.html" class="btn" 		        data-header="login" >Login</a>
    {/if}
</header>


<style lang="sass" global>
  @import 'media.sass'
  @import 'colors.sass'

  HEADER#mainHeadline
    display: block
    position: fixed
    height: 1cm
    left: 0px
    right: 0px
    top: 0px
    @include gradient-bg

    >.btn
      display: inline-block
      color: var(--app-c-headline-btn-text)
      background-color: var(--app-c-headline-btn-bg)
      line-height: 1cm
      margin-inline: calc(var(--body-margin) / 2)
      padding-block: 0px

      .fa
        line-height: inherit !important

      &:hover
        background-color: var(--app-c-headline-btn-text)
        color: var(--app-c-headline-btn-bg)
        color: black

        line-height: 8mm
        margin-block: 1mm

    & :last-child
      float: right

  DIV.btnStandin
    display: inline-block
    width: 1.15cm
    margin-inline:  calc(var(--body-margin) / 2)
    height: 1cm
    float: left

  #ApplicationTitleBar
    display: inline-block
    font-size: 1.5em
    color: var(--app-c-headline-btn-text)
    line-height: 1cm

    @media(min-width: $media-md)
      margin-left: 14rem


</style>