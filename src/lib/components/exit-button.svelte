<script lang="ts">
    import * as process from "@tauri-apps/plugin-process";

    async function exit(): Promise<void> {
        await process.exit();
    }
</script>

<button class="menu-button secondary-button" onclick={exit}>Beenden</button>

<style>
    button {
        position: absolute;
        border: 0;
        right: 0;
        width: var(--button-width);
        height: var(--button-width);
    }
</style>
