<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";

    interface ColorSchemeButtonProps {
        id: string;
        text: string;
    }

    let { id, text }: ColorSchemeButtonProps = $props();

    function setColourScheme(): void {
        settings.colorSchemeId = id;
        document.documentElement.setAttribute("data-colorscheme", id);
    }
</script>

<button class="menu-button secondary-button" onclick={setColourScheme}>
    {text}
</button>
