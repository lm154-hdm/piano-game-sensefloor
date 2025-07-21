<script lang="ts">
    import { colorSchemes, settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import ColorSchemeButton from "$lib/components/color-scheme-button.svelte";
    import ColorSchemePreview from "$lib/components/color-scheme-preview.svelte";
  import LabelledSettingsColumn from "$lib/components/labelled-settings-container/labelled-settings-column.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container/labelled-settings-container.svelte";
  import LabelledSettingsRow from "$lib/components/labelled-settings-container/labelled-settings-row.svelte";
    import Title from "$lib/components/title.svelte";
    import ResetButton from "$lib/components/reset-button.svelte";

    function getDefaultName(): string | undefined {
        return colorSchemes.find((c) => c.id === "default")?.displayText;
    }

    function setColorSchemeToDefault() {
        settings.colorSchemeId = "default"
        document.documentElement.setAttribute("data-colorscheme", "default");
    }

    function getCurrentColorSchemeName(): string | undefined {
        return colorSchemes.find((colorScheme) => colorScheme.id === settings.colorSchemeId)?.displayText;
    }
</script>

<Title text="Einstellungen - Farbschema" />

<ResetButton text={getDefaultName()} onClick={setColorSchemeToDefault}/>

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
