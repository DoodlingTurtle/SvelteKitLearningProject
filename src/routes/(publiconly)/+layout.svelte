<script>
    import { goto } from '$app/navigation'
    import { loggedin } from '$lib/stores';
    
    if($loggedin) goto("/");
</script>
<slot/>