<script lang="ts">
    import "../app.css";
    import { load } from "$lib/backend/settings.svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { onMount } from "svelte";
    import * as Tone from "tone";

    const { children } = $props();

    onMount(async () => {
        const window = getCurrentWindow();
        await window.show();
        await window.setFullscreen(true);
        await window.setFocus();

        await load();
        await Tone.loaded();
        Tone.getContext().lookAhead = 0;
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
