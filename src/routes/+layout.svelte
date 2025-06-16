<script lang="ts">
    import { onMount } from "svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import "../app.css";

    onMount(async () => {
        const window = getCurrentWindow();
        await window.setFullscreen(true);
        await window.show();
        await window.setFocus();
    });
</script>

<main>
    <slot />
</main>

<style>
    main {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        width: 100vw;
        height: 100vh;
    }
</style>
