<script lang="ts">
    import { Mode, settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import GhostButton from "$lib/components/ghost-button.svelte";
    import LabelledSettingsContainer from "$lib/components/labelled-settings-container/labelled-settings-container.svelte";
    import LabelledSettingsRow from "$lib/components/labelled-settings-container/labelled-settings-row.svelte";
    import Title from "$lib/components/title.svelte";
    import LabelledSettingsColumn from "$lib/components/labelled-settings-container/labelled-settings-column.svelte";
</script>

<Title text="Einstellungen - Modus" />

<LabelledSettingsContainer text="Aktueller Modus: {Mode[settings.mode]}">
    <LabelledSettingsColumn>
        {#if settings.mode === Mode.Normal}
            <h3>Normaler Song-Durchlauf.<br/>Taste muss zum richtigen Zeitpunkt getreten werden, um korrekten Ton abzuspielen.</h3>
        {:else if settings.mode === Mode.Pause}
            <h3>Anfänger-Modus. <br> Song pausiert vor jeder Note.</h3>
        {:else if settings.mode === Mode.Playback}
            <h3>Töne werden (unabhängig des Tretens) immer korrekt abgespielt.</h3>
        {/if}
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
                Pause
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
    </LabelledSettingsColumn>
</LabelledSettingsContainer>
<BackButton text="Speichern und zurück" slug="/sensfloor/menu/settings" shouldSave={true} />

<style>
    h3 {
        text-align: center;
        line-height: 1.5;
    }
</style>