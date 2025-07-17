<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import GhostButton from "$lib/components/ghost-button.svelte";
    import LabelledSettingsColumn from "$lib/components/labelled-settings-container/labelled-settings-column.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container/labelled-settings-container.svelte";
    import LabelledSettingsRow from "$lib/components/labelled-settings-container/labelled-settings-row.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Einstellungen - Puffer" />

<LabelledSettingsContainer text="Aktueller Puffer: {settings.buffer.toFixed(2)} Sekunden">
    <LabelledSettingsColumn>
        <h3>Wie viele Sekunden im Voraus soll es möglich sein, auf eine Taste zu treten?</h3>
        <LabelledSettingsRow>
            <button
                    class="menu-button secondary-button"
                    onclick={() => {
                settings.buffer = Math.max(settings.buffer - 0.05, 0);
            }}
            >
                Kleiner<br/>-0.05s
            </button>
            <button
                    class="menu-button secondary-button"
                    onclick={() => {
                settings.buffer = 0.1;
            }}
            >
                Standard
            </button>
            <button
                    class="menu-button secondary-button"
                    onclick={() => {
                settings.buffer = Math.min(settings.buffer + 0.05, 3)
            }}
            >
                Größer<br/>+0.05s
            </button>
            <GhostButton />
        </LabelledSettingsRow>
    </LabelledSettingsColumn>
</LabelledSettingsContainer>

<BackButton text="Speichern und zurück" slug="/sensfloor/menu/settings" shouldSave={true} />

<style>
    h3 {
        margin-bottom: 50px;
    }
</style>
