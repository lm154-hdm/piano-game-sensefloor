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
            goto("/admin");
        }
    }
</script>

<main class="stretch-screen flex-bottom flex-row">
    {@render children()}
</main>
