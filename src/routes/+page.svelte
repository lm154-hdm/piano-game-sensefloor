<script lang="ts">
    import { initialise, connect } from "$lib/backend/sens-floor";
    import { onMount } from "svelte";

    onMount(() => {
        initialise(6, 8);
        connect("192.168.178.22", 8000);
    });
</script>
