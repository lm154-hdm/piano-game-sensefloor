<script lang="ts">
    import { settings, colorSchemes } from "$lib/backend/settings.svelte";

    function onChangeBpm(event: Event): void {
        console.log(`Changed bpm to ${settings.bpm}`);
    }

    function onColorSchemeChange(event: Event): void {
        console.log(`Changed color scheme to '${settings.colorSchemeId}'`);
    }
</script>

<main>
    <a href="/prototype" role="button">Play</a>
    <hr />
    <div>
        <label for="bpm-input">Bpm: {settings.bpm}</label>
        <br />
        <input
            id="bpm-input"
            name="bpm-input"
            type="range"
            min="20"
            max="200"
            step="1"
            defaultValue="120"
            onchange={onChangeBpm}
            bind:value={settings.bpm}
        />
    </div>
    <hr />
    <div>
        <label for="color-scheme-select">Color scheme: {settings.colorSchemeId}</label>
        <br />
        <select
            id="bpm-input"
            name="color-scheme-select"
            onchange={onColorSchemeChange}
            bind:value={settings.colorSchemeId}
        >
            {#each colorSchemes as colorScheme}
                <option value={colorScheme.id}>{colorScheme.displayText}</option>
            {/each}
        </select>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100vw;
        height: 100vh;
    }

    hr {
        width: 200px;
    }
</style>
