<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    let { children } = $props();

    onMount(() => {
        document.getElementById("application-container")?.classList.add("align-center");
    });

    onDestroy(() => {
        document.getElementById("application-container")?.classList.remove("align-center");
    });
</script>

{@render children()}
