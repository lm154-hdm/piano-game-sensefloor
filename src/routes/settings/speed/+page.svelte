<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Einstellungen - Geschwindigkeit" />

<LabelledSettingsContainer text="Aktuelle Geschwindigkeit: {settings.speed}%">
    <button
        class="menu-button primary-button"
        onclick={() => {
            settings.speed -= 10;
        }}
    >
        Langsamer (-10%)
    </button>
    <button
        class="menu-button primary-button"
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
        height: var(--button-width);
    }
</style>
