<script lang="ts">
    import { colorSchemes, settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import ColorSchemeButton from "$lib/components/color-scheme-button.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container.svelte";
    import Title from "$lib/components/title.svelte";

    function getCurrentColorSchemeName(): string | undefined {
        return colorSchemes.find((colorScheme) => colorScheme.id === settings.colorSchemeId)?.displayText;
    }
</script>

<Title text="Einstellungen - Farbschema" />

<LabelledSettingsContainer text="Aktuelles Farbschema: {getCurrentColorSchemeName()}">
    {#each colorSchemes as { id, displayText }}
        <ColorSchemeButton {id} text={displayText} />
    {/each}
</LabelledSettingsContainer>

<BackButton slug="/settings" />
