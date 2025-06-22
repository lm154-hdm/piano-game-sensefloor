<script lang="ts">
    import { load } from "$lib/backend/settings.svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { onMount } from "svelte";
    import "../app.css";

    const { children } = $props();

    onMount(async () => {
        await load();

        const window = getCurrentWindow();
        await window.setFullscreen(true);
        await window.show();
        await window.setFocus();
    });
</script>

<main>
    <div id="application-container">
        {@render children()}
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: var(--crop-left);
        width: calc(100vw - var(--crop-left) - var(--crop-right));
        height: 100vh;
    }

    #application-container {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: var(--background-color);
    }
</style>
