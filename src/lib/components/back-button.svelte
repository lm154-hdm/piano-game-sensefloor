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
    <button class="menu-button secondary-button" onclick={onClick}>{text}</button>
</a>

<style>
    a {
        position: absolute;
        bottom: 0;
        right: 0;
        width: var(--button-width);
        height: var(--button-width);
    }
</style>
