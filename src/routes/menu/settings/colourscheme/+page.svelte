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


<div class="color-scheme-preview-container">
    <h2>Vorschau:</h2>
    <div class="color-scheme-preview">
        <div class="color-scheme-preview-item primary-button"></div>
        <div class="color-scheme-preview-item secondary-button"></div>
        <div class="color-scheme-preview-item error-button"></div>
    </div>
</div>

<LabelledSettingsContainer text="Aktuelles Farbschema: {getCurrentColorSchemeName()}">
    {#each colorSchemes as { id, displayText }}
        <ColorSchemeButton {id} text={displayText} />
    {/each}
</LabelledSettingsContainer>

<BackButton text="Speichern und zurück" slug="/menu/settings" shouldSave={true} />
