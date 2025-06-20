<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Einstellungen - Geschwindigkeit" />

<LabelledSettingsContainer text="Aktuelle Geschwindigkeit: {settings.speed}%">
    <button
        onclick={() => {
            settings.speed -= 10;
        }}
    >
        Langsamer (-10%)
    </button>
    <button
        onclick={() => {
            settings.speed += 10;
        }}
    >
        Schneller (+10%)
    </button>
</LabelledSettingsContainer>

<BackButton text="Speichern und zurück" slug="/settings" shouldSave={true} />

<style>
    button {
        width: var(--button-width);
        aspect-ratio: 1 / 1;
        text-align: center;
        font-size: 1.2em;
        background-color: var(--primary);
        color: var(--text-dark);
        border-radius: 5%;
        border: 2px solid var(--background-color);
    }
</style>
