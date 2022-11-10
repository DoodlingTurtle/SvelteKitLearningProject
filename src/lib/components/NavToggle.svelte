<script> 
  import { menuOpen } from "../stores"; 

  const toggleMenu = () => $menuOpen = !$menuOpen;

  export let cssClass = "";

</script>

<a href={"#"} on:mouseenter={() => $menuOpen=true} on:click|preventDefault={toggleMenu} class="{cssClass} fa fa-bars">&nbsp;</a>

<style lang="sass">
@import '../css/media'
@media (min-width: $media-md)
  A
    display: none !important
</style>