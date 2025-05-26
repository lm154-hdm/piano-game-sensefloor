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

<slot />
