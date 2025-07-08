<script lang="ts">
    import { save } from "$lib/backend/settings.svelte";

    interface BackButtonProps {
        text: string;
        slug: string;
        shouldSave?: boolean;
    }

    let { text, slug, shouldSave = false }: BackButtonProps = $props();

    async function onClick(): Promise<void> {
        if (shouldSave) {
            await save();
        }
    }
</script>

<a href={slug}>
    <button class="menu-button primary-button bottom-right-button" onclick={onClick}>{text}</button>
</a>

<style>
    a {
        bottom: 0;
        width: var(--button-width);
        height: var(--button-width);
    }
</style>
