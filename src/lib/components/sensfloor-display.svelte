<script lang="ts">
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";
    import { onDestroy } from "svelte";
    import SensfloorPad from "./sensfloor-pad.svelte";

    interface SensFloorDisplayData {
        x: { length: number };
        y: { length: number };
        cellSize: number;
        isPadHighlighted: boolean[];
    }

    let containerWidth: number = $state(0);
    let containerHeight: number = $state(0);
    let displayData: SensFloorDisplayData = $state({
        x: { length: 0 },
        y: { length: 0 },
        cellSize: 0,
        isPadHighlighted: [],
    });

    // Don't call this in onMount because we need to initialise the SensFloor before rendering
    initialise();

    $effect(() => {
        const cellWidth = containerWidth / displayData.y.length;
        const cellHeight = containerHeight / displayData.x.length;
        displayData.cellSize = Math.min(cellWidth, cellHeight);
    });

    onDestroy(() => {
        SensFloor.disconnect();
        SensFloor.removeAllListeners();
    });

    function initialise() {
        SensFloor.initialise(8, 6);
        SensFloor.connect("192.168.178.22", 8000);
        SensFloor.addStepOnListener((event: SensFloor.StepEventData) => {
            highlightElement(event.normalisedX, event.normalisedY, true);
        });
        SensFloor.addStepOffListener((event: SensFloor.StepEventData) => {
            highlightElement(event.normalisedX, event.normalisedY, false);
        });

        const { x, y } = SensFloor.getDimension();
        displayData.x.length = x;
        displayData.y.length = y;
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                displayData.isPadHighlighted.push(false);
            }
        }
    }

    function highlightElement(x: number, y: number, highlight: boolean): void {
        x = Math.floor(x * displayData.x.length);
        y = Math.floor(y * displayData.y.length);
        const index = x * y;
        displayData.isPadHighlighted[index] = highlight;
    }
</script>

<div
    class="sensfloor-display"
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
    style="--rows: {displayData.x.length}; --columns: {displayData.y.length}; --cell-size: {displayData.cellSize}px"
>
    {#each displayData.x as _, x}
        {#each displayData.y as _, y}
            <SensfloorPad isHighlighted={displayData.isPadHighlighted[x * y]} />
        {/each}
    {/each}
</div>

<style>
    .sensfloor-display {
        position: relative;
        height: 60%;
        width: 100%;
        justify-content: center;
        display: grid;
        grid-template-rows: repeat(var(--rows), var(--cell-size));
        grid-template-columns: repeat(var(--columns), var(--cell-size));
        gap: 0;
        background-color: transparent;
    }
</style>
