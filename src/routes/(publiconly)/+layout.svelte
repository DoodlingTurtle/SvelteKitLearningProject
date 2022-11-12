<script>
    import RedirectGate from "$lib/components/RedirectGate.svelte";
    import { loggedin } from "$lib/stores";

</script>
<RedirectGate
    passcondition={ !$loggedin }
    redirect="/"
>
    <slot />
</RedirectGate>