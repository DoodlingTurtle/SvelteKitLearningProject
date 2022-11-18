<script lang="ts">
    import RedirectGate from '$lib/components/RedirectGate.svelte';
    import { user_modules } from '$lib/stores';
</script>

<RedirectGate 
    passcondition={$user_modules.edit_user||false} 
    logout={true}
>
    <slot />
</RedirectGate>