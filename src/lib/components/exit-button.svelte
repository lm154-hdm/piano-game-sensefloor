<script lang="ts">
    import * as process from "@tauri-apps/plugin-process";

    async function exit(): Promise<void> {
        await process.exit();
    }
</script>

<button class="menu-button error-button bottom-right-button" onclick={exit}>Beenden</button>

<style>
    button {
        width: var(--button-width);
        height: var(--button-width);
    }
</style>
