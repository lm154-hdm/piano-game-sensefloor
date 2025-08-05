<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/buttons/back-button.svelte";
    import LabelledSettingsColumn from "$lib/components/labelled-settings-container/labelled-settings-column.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container/labelled-settings-container.svelte";
    import LabelledSettingsRow from "$lib/components/labelled-settings-container/labelled-settings-row.svelte";
    import Title from "$lib/components/title.svelte";
    import SettingsButton from "$lib/components/buttons/settings-button.svelte";
</script>

<Title text="Einstellungen - Puffer" />

<LabelledSettingsContainer text="Aktueller Puffer: {settings.buffer.toFixed(2)} Sekunden">
    <LabelledSettingsColumn>
        <h3>Wie viele Sekunden im Voraus soll es möglich sein, auf eine Taste zu treten?</h3>
        <LabelledSettingsRow>
            <SettingsButton
                label="Kleiner"
                details="-0.05s"
                onClick={() => settings.buffer = Math.max(settings.buffer - 0.05, 0) }
            />
            <SettingsButton
                    label="Größer"
                    details="+0.05s"
                    onClick={() => settings.buffer = Math.min(settings.buffer + 0.05, 3) }
            />
        </LabelledSettingsRow>
    </LabelledSettingsColumn>
</LabelledSettingsContainer>

<SettingsButton
        details="0.1s"
        onClick={() => settings.buffer = 0.1 }
        reset={true}
/>
<BackButton text="Speichern und zurück" slug="/sensfloor/menu/settings" shouldSave={true} />

<style>
    h3 {
        margin-bottom: 50px;
    }
</style>
