<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/buttons/back-button.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container/labelled-settings-container.svelte";
    import LabelledSettingsRow from "$lib/components/labelled-settings-container/labelled-settings-row.svelte";
    import Title from "$lib/components/title.svelte";
    import SettingsButton from "$lib/components/buttons/settings-button.svelte";
</script>

<Title text="Einstellungen - Geschwindigkeit" />

<LabelledSettingsContainer text="Aktuelle Geschwindigkeit: {settings.speed}%">
    <LabelledSettingsRow>
        <SettingsButton
                label="Langsamer"
                details="-10%"
                onClick="{() => settings.speed = Math.max(settings.speed - 10, 10)}"
        />
        <SettingsButton
                label="Schneller"
                details="+10%"
                onClick="{() => settings.speed += 10}"
        />
    </LabelledSettingsRow>
</LabelledSettingsContainer>

<SettingsButton
        label="Langsamer"
        details="100%"
        onClick="{() => settings.speed = 100}"
        reset={true}
/>

<BackButton text="Speichern und zurück" slug="/sensfloor/menu/settings" shouldSave={true} />
