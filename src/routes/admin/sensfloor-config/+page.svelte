<script lang="ts">
    import { ConnectionState } from "$lib/backend/sens-floor/sens-floor";
    import BackButton from "$lib/components/back-button.svelte";
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";

    let ip: String = $state("");
    let port: number = $state(0);
    let isValidIpAddress: boolean = $state(false);
    let connectionState: ConnectionState = $state(ConnectionState.NONE);

    const regex: RegExp =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    function onIpChange(event: Event): void {
        const element = event.target as HTMLInputElement;
        isValidIpAddress = regex.test(element.value);
    }

    async function connect(): Promise<void> {
        connectionState = ConnectionState.CONNECTING;

        SensFloor.disconnect();

        connectionState = await SensFloor.load();
    }
</script>

<Title text="Adminpanel - SensFloor-Konfiguration" />

<label>
    <input
        bind:value={ip}
        class={ip && isValidIpAddress ? "ip-input-valid" : "ip-input-invalid"}
        type="text"
        placeholder="127.0.0.1"
    />
    IP-Adresse
</label>
<br />
<label>
    <input bind:value={port} type="number" placeholder="1337" />
    Port
</label>

<button onclick={connect}>Mit SensFloor verbinden</button>

<NavigationButton text="Songauswahl" slug="/admin/songselection" />
<NavigationButton text="SensFloor-Ausrichtung" slug="/admin/sensfloor-alignment" />
<NavigationButton text="SensFloor zuschneiden" slug="/admin/sensfloor-cropping" />
<BackButton text="Hauptmenü" slug="/menu" />

<style>
    .ip-input-valid {
        outline: green solid;
    }

    .ip-input-invalid {
        outline: red solid;
    }
</style>
