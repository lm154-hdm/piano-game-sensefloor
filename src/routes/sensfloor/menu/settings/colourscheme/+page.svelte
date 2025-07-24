<script lang="ts">
    import { colorSchemes, settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/buttons/back-button.svelte";
    import ColorSchemeButton from "$lib/components/buttons/color-scheme-button.svelte";
    import ColorSchemePreview from "$lib/components/color-scheme-preview.svelte";
    import LabelledSettingsColumn from "$lib/components/labelled-settings-container/labelled-settings-column.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container/labelled-settings-container.svelte";
    import LabelledSettingsRow from "$lib/components/labelled-settings-container/labelled-settings-row.svelte";
    import Title from "$lib/components/title.svelte";

    function getCurrentColorSchemeName(): string | undefined {
        return colorSchemes.find((colorScheme) => colorScheme.id === settings.colorSchemeId)?.displayText;
    }
</script>

<Title text="Einstellungen - Farbschema" />

<LabelledSettingsContainer text="Aktuelles Farbschema: {getCurrentColorSchemeName()}">
    <LabelledSettingsColumn>
        <ColorSchemePreview />
        <LabelledSettingsRow>
            {#each colorSchemes as { id, displayText }}
                <ColorSchemeButton {id} text={displayText} />
            {/each}
        </LabelledSettingsRow>
    </LabelledSettingsColumn>
</LabelledSettingsContainer>

<BackButton text="Speichern und zurück" slug="/sensfloor/menu/settings" shouldSave={true} />
