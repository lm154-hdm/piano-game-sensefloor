<script lang="ts">
    import { Mode, settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Einstellungen - Modus" />

<LabelledSettingsContainer text="Aktueller Modus: {Mode[settings.mode]}">
    <button
        onclick={() => {
            settings.mode = Mode.Playback;
        }}
    >
        Playback
    </button>
    <button
        onclick={() => {
            settings.mode = Mode.Pause;
        }}
    >
        Stop / Pause
    </button>
</LabelledSettingsContainer>

<BackButton text="Speichern und zurück" slug="/settings" shouldSave={true} />

<style>
    button {
        width: var(--button-width);
        aspect-ratio: 1 / 1;
        text-align: center;
    }
</style>
