<script lang="ts">
    import { Mode, settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import GhostButton from "$lib/components/ghost-button.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container/labelled-settings-container.svelte";
    import LabelledSettingsRow from "$lib/components/labelled-settings-container/labelled-settings-row.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Einstellungen - Modus" />

<LabelledSettingsContainer text="Aktueller Modus: {Mode[settings.mode]}">
    <LabelledSettingsRow>
        <button
            class="menu-button secondary-button"
            onclick={() => {
                settings.mode = Mode.Normal;
            }}
        >
            Normal
        </button>
        <button
            class="menu-button secondary-button"
            onclick={() => {
                settings.mode = Mode.Pause;
            }}
        >
            Stop / Pause
        </button>
        <button
            class="menu-button secondary-button"
            onclick={() => {
                settings.mode = Mode.Playback;
            }}
        >
            Playback
        </button>
        <GhostButton />
    </LabelledSettingsRow>
</LabelledSettingsContainer>
<BackButton text="Speichern und zurück" slug="/sensfloor/menu/settings" shouldSave={true} />
