<script lang="ts">
    import { connect } from "$lib/backend/socket";
    import { onMount } from "svelte";

    onMount(() => {
        connect("192.168.178.22", 8000);
    });
</script>
