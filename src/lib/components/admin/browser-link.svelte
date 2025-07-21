<script lang="ts">
    import { openUrl } from "@tauri-apps/plugin-opener";

    interface BrowserLinkProps {
        url: string;
        text: string;
    }

    let { url, text }: BrowserLinkProps = $props();

    async function onClick(): Promise<void> {
        await openUrl(url);
    }
</script>

<span onclick={onClick}>{text}</span>

<style>
    span {
        pointer-events: all;
        text-decoration: underline;
    }

    span:hover {
        cursor: pointer;
    }
</style>