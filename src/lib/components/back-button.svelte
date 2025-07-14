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

<a class="menu-button primary-button bottom-right-button" href={slug}>{text}</a>

<style>
    .bottom-right-button {
        width: var(--button-width);
        height: var(--button-width);
    }
</style>
