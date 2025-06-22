<script lang="ts">
    import { goto } from "$app/navigation";
    import ExitButton from "$lib/components/exit-button.svelte";
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
    import { onDestroy, onMount } from "svelte";

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

<Title text="Menü" />
<NavigationButton text="Spielen" slug="/prototype" />
<NavigationButton text="Einstellungen" slug="/settings" />
<ExitButton />
