<script lang="ts">
    import { save } from "$lib/backend/settings.svelte";

    interface BackButtonProps {
        text: string;
        slug: string;
        shouldSave?: boolean;
    }

    let { text, slug, shouldSave = true }: BackButtonProps = $props();

    async function onClick(): Promise<void> {
        if (shouldSave) {
            console.log("Save");
            await save();
        }
    }
</script>

<a href={slug}>
    <button onclick={onClick}>{text}</button>
</a>

<style>
    a {
        position: absolute;
        bottom: 0;
        right: 0;
        width: var(--button-width);
        aspect-ratio: 1 / 1;
    }

    button {
        width: 100%;
        height: 100%;
        text-align: center;
        font-size: 1.2em;
        background-color: var(--accent);
        color: var(--text);
        border-radius: 5%;
        border: 2px solid var(--background-color);
    }
</style>
