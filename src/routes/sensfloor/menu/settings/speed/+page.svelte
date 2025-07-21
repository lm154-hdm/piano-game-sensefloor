<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container/labelled-settings-container.svelte";
    import LabelledSettingsRow from "$lib/components/labelled-settings-container/labelled-settings-row.svelte";
    import Title from "$lib/components/title.svelte";
    import ResetButton from "$lib/components/reset-button.svelte";
</script>

<Title text="Einstellungen - Geschwindigkeit" />

<ResetButton text="100%" onClick={() => settings.speed = 100 }/>

<LabelledSettingsContainer text="Aktuelle Geschwindigkeit: {settings.speed}%">
    <LabelledSettingsRow>
        <button
            class="menu-button secondary-button"
            onclick={() => {
                settings.speed = Math.max(settings.speed - 10, 10);
            }}
        >
            Langsamer<br/>-10%
        </button>
        <button
            class="menu-button secondary-button"
            onclick={() => {
                settings.speed += 10;
            }}
        >
            Schneller<br/>+10%
        </button>
    </LabelledSettingsRow>
</LabelledSettingsContainer>

<BackButton text="Speichern und zurück" slug="/sensfloor/menu/settings" shouldSave={true} />
