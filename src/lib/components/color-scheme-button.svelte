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
        text-align: center;
        font-size: 1.2em;
        background-color: var(--primary);
        color: var(--text-dark);
        border-radius:5%;
        border: 2px solid var(--background-color);
    }

    :global(.colorscheme-button-default) {
    }

    :global(.colorscheme-button-blueYellow) {
    }
</style>
