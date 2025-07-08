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

    let sensFloorState: SensFloorState = $state(SensFloorState.NONE);

    onMount(async () => {
        /*await Settings.load();

        await Tone.loaded();
        Tone.getContext().lookAhead = 0;

        const window = getCurrentWindow();
        await window.show();
        await window.setFullscreen(true);
        await window.setFocus();

        await connect();*/
        goto("/menu"); //for debug, delete before push and uncomment code above.
    });

    async function connect(): Promise<void> {
        sensFloorState = SensFloorState.NONE;

        sensFloorState = await SensFloor.load();
        switch (sensFloorState) {
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
    {#if sensFloorState === SensFloorState.NONE}
        <Loader />
        <p>Verbindung mit SensFloor wird hergestellt</p>
    {:else if sensFloorState === SensFloorState.MISSING_CONFIGURATION}
        <ErrorCard>
            <p><strong>Die Konfigurationdatei für den SensFloor ist unvollständig</strong></p>
            <p>Bitte überprüfen Sie, ob in der ".env"-Datei des Projektes die folgenden Variablen definiert sind:</p>
            <ul>
                <li>VITE_SENSFLOOR_IP</li>
                <li>VITE_SENSFLOOR_PORT</li>
                <li>VITE_SENSFLOOR_WIDTH</li>
                <li>VITE_SENSFLOOR_HEIGHT</li>
                <li>VITE_SENSFLOOR_ROTATE_BY</li>
                <li>VITE_SENSFLOOR_FLIP_X</li>
                <li>VITE_SENSFLOOR_FLIP_Y</li>
                <li>VITE_APPLICATION_CROP_LEFT</li>
                <li>VITE_APPLICATION_CROP_RIGHT</li>
                <li>VITE_APPLICATION_CROP_TOP</li>
                <li>VITE_APPLICATION_CROP_BOTTOM</li>
                <li>VITE_SENSFLOOR_OFFSET_LEFT</li>
                <li>VITE_SENSFLOOR_OFFSET_RIGHT</li>
                <li>VITE_SENSFLOOR_OFFSET_TOP</li>
                <li>VITE_SENSFLOOR_OFFSET_BOTTOM</li>
            </ul>
        </ErrorCard>
    {:else if sensFloorState === SensFloorState.CONNECTION_FAILED}
        <ErrorCard>
            <p>
                <strong>Die Verbindung ist aufgrund eines Timeouts fehlgeschlagen.</strong><br />Bitte überprüfen Sie,
                ob:
            </p>
            <ul>
                <li>das Gerät und der SensFloor im selben Netzwerk sind</li>
                <li>der SensFloor eingesteckt ist</li>
                <li>die korrekte IP-Adresse sowie der korrekte Port in der .env-Datei des Projektes angegeben sind</li>
            </ul>
            <button class="primary-button" onclick={connect}>Erneut versuchen</button>
        </ErrorCard>
    {:else if sensFloorState === SensFloorState.CONNECTION_TIMEOUT}
        <ErrorCard>
            <p><strong>Die Verbindung ist fehlgeschlagen.</strong><br />Bitte überprüfen Sie, ob:</p>
            <ul>
                <li>das Gerät und der SensFloor im selben Netzwerk sind</li>
                <li>der SensFloor eingesteckt ist</li>
                <li>die korrekte IP-Adresse sowie der korrekte Port in der .env-Datei des Projektes angegeben sind</li>
            </ul>
            <button class="primary-button" onclick={connect}>Erneut versuchen</button>
        </ErrorCard>
    {/if}
</main>
