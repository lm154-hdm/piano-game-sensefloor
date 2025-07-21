<script lang="ts">
    import * as process from "@tauri-apps/plugin-process";

    async function exit(): Promise<void> {
        await process.exit();
    }
</script>

<button class="menu-button error-button bottom-right-corner" onclick={exit}>
    Beenden
</button>
