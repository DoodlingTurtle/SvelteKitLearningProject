<script>
    import RedirectGate from "$lib/components/RedirectGate.svelte";
    import { loggedin } from "$lib/modules/Stores";

</script>
<RedirectGate
    passcondition={ !$loggedin }
    redirect="/"
>
    <slot />
</RedirectGate>