<script>
    import { user_modules } from "../lib/modules/Stores";
</script>

<footer id="mainFooterline">
    {#if $user_modules.edit_user}
      <a href="/users/list.html" class="fa fa-solid fa-user">&nbsp;</a>
    {/if}

    <span></span>


    <a href={"#"} class="online_state">&nbsp;</a>
</footer>

<style lang="scss">
@import 'media.sass';
@import 'colors.sass';

footer {

  padding: 2mm;
  height: 6mm;
  width: calc(100vw - 4mm);
  position: fixed;
  left: 0px;
  bottom: 0px;
  color: var(--accent-text);
  display: flex;
  z-index: 3;
  @include gradient-bg;

  SPAN::after {
    content: "< xs";
    @media (min-width: $media-xs) { content: "xs"; }
    @media (min-width: $media-sm) { content: "sm"; }
    @media (min-width: $media-md) { content: "md"; }
    @media (min-width: $media-lg) { content: "lg"; }
    @media (min-width: $media-xl) { content: "xl"; }
    @media (min-width: $media-xxl) { content: "xxl"; }
  }


  A.fa {
    height: 6mm;
    width: 6mm;
    font-size: 6mm;
    text-decoration: none;
    color: var(--accent-text);
  }

  .online_state {
    flex-grow: 1;
    text-align: right;
  }

  &::after {
    content: "";
    clear: both;
  }

}
</style>
