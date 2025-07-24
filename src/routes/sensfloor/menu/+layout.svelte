<script lang="ts">
    import { goto } from "$app/navigation";
    import { onDestroy, onMount } from "svelte";

    let { children } = $props();

    onMount(() => {
        window.addEventListener("keydown", onKeyDown);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", onKeyDown);
    });

    function onKeyDown(event: KeyboardEvent): void {
        if (event.key === "1") {
            goto("/admin/songselection");
        }
        if (event.key === "2" && import.meta.env.DEV) {
            goto("/admin/sensfloor-cropping");
        }
    }
</script>

{@render children()}
