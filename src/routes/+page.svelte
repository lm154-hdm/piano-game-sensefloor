<script lang="ts">
    import ErrorCard from "$lib/components/error-card.svelte";
    import Loader from "$lib/components/loader.svelte";
    import { SensFloorState } from "$lib/backend/sens-floor/sens-floor";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import * as Tone from "tone";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";
    import * as Settings from "$lib/backend/settings.svelte";

    let connectionState: SensFloorState = $state(SensFloorState.NONE);

    onMount(async () => {
        await Settings.load();

        await Tone.loaded();
        Tone.getContext().lookAhead = 0;

        const window = getCurrentWindow();
        await window.show();
        await window.setFullscreen(true);
        await window.setFocus();

        await connect();
    });

    async function connect(): Promise<void> {
        connectionState = SensFloorState.NONE;

        connectionState = await SensFloor.load();
        switch (connectionState) {
            case SensFloorState.ALREADY_CONNECTED:
                goto("/menu");
                break;
            case SensFloorState.CONNECTION_SUCCESSFUL:
                goto("/menu");
                break;
        }
    }
</script>

<main class="stretch-screen flex-center flex-column">
    {#if connectionState === SensFloorState.NONE}
        <Loader />
        <p>Verbindung mit SensFloor wird hergestellt</p>
    {:else if connectionState === SensFloorState.MISSING_CONFIGURATION}
        <ErrorCard
            buttonText="Zum Adminpanel"
            buttonClick={() => {
                goto("/admin/sensfloor-config");
            }}
        >
            <p><strong>Es sind keine Verbindungsinformationen für den SensFloor vorhanden</strong></p>
            <p>
                Die Konfigurations-Datei, in welcher die Verbindungsinformationen für den SensFloor gespeichert werden,
                konnte nicht gefunden werden.<br />
                Bitte gehen Sie mit Hilfe des folgenden Buttons zum Admin-Panel und geben Sie dort die Verbindungsinformationen
                an.
            </p>
        </ErrorCard>
    {:else if connectionState === SensFloorState.CONNECTION_FAILED}
        <ErrorCard buttonText="Erneut versuchen" buttonClick={connect}>
            <p>
                <strong>Die Verbindung ist aufgrund eines Timeouts fehlgeschlagen.</strong><br />Bitte überprüfen Sie,
                ob:
            </p>
            <ul>
                <li>das Gerät und der SensFloor im selben Netzwerk sind</li>
                <li>der SensFloor eingesteckt ist</li>
                <li>die korrekte IP-Adresse sowie der korrekte Port in der .env-Datei des Projektes angegeben sind</li>
            </ul>
        </ErrorCard>
    {:else if connectionState === SensFloorState.CONNECTION_TIMEOUT}
        <ErrorCard buttonText="Erneut versuchen" buttonClick={connect}>
            <p><strong>Die Verbindung ist fehlgeschlagen.</strong><br />Bitte überprüfen Sie, ob:</p>
            <ul>
                <li>das Gerät und der SensFloor im selben Netzwerk sind</li>
                <li>der SensFloor eingesteckt ist</li>
                <li>die korrekte IP-Adresse sowie der korrekte Port in der .env-Datei des Projektes angegeben sind</li>
            </ul>
        </ErrorCard>
    {/if}
</main>
