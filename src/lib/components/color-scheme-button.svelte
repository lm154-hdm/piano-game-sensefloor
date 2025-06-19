<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";

    const { id, text }: { id: string; text: string } = $props();

    function setColourScheme(): void {
        settings.colorSchemeId = id;
        document.documentElement.setAttribute("data-colorscheme", id);
    }
</script>

<button class="colorscheme-button-{id}" onclick={setColourScheme}>
    {text}
</button>

<style>
    button {
        width: var(--button-width);
        aspect-ratio: 1 / 1;
    }

    :global(.colorscheme-button-default) {
    }

    :global(.colorscheme-button-monochrome) {
    }
</style>
