<script>
    import { goto } from '$app/navigation'
    import { cleanStore, loggedin } from '$lib/stores';
    
    if($loggedin) goto("/");
    else cleanStore();
</script>
<slot/>