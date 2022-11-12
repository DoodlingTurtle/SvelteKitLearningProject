<script>
    import RedirectGate from "$lib/components/RedirectGate.svelte";
    import { user_modules } from '$lib/stores'
</script>

<RedirectGate 
    passcondition={$user_modules.core||false}
    logout={true}
>
    <slot />
</RedirectGate>