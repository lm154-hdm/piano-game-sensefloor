<script lang="ts">
    type ColorSchemeData = {
        id: string;
        displayText: string;
    };

    const colorSchemes: ColorSchemeData[] = [
        {
            id: "default",
            displayText: "Default",
        },
        {
            id: "redgreen",
            displayText: "Red-green",
        },
        {
            id: "monochromatic",
            displayText: "Monochromatic",
        },
    ];

    let bpm: number = $state(120);
    let colorScheme: string = $state("default");

    function onChangeBpm(event: Event): void {
        console.log(`Changed bpm to ${bpm}`);
    }

    function onColorSchemeChange(event: Event): void {
        console.log(`Changed color scheme to '${colorScheme}'`);
    }
</script>

<main>
    <a href="/prototype" role="button">Play</a>
    <hr />
    <div>
        <label for="bpm-input">Bpm: {bpm}</label>
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
            bind:value={bpm}
        />
    </div>
    <hr />
    <div>
        <label for="color-scheme-select">Color scheme: {colorScheme}</label>
        <br />
        <select
            id="bpm-input"
            name="color-scheme-select"
            onchange={onColorSchemeChange}
            bind:value={colorScheme}
        >
            {#each colorSchemes as cs}
                <option value={cs.id}>{cs.displayText}</option>
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
