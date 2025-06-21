<script lang="ts">
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";

    let elements: HTMLDivElement[] = $state([]);

    SensFloor.initialise(8, 6);
    SensFloor.connect("192.168.178.22", 8000);
    SensFloor.addStepOnListener((event: SensFloor.StepEventData) => {
        highlightElement(event.padX - 1, event.padY - 1, true);
    });
    SensFloor.addStepOnListener((event: SensFloor.StepEventData) => {
        highlightElement(event.padX - 1, event.padY - 1, false);
    });

    function highlightElement(x: number, y: number, highlight: boolean): void {
        const element = elements[x + 1 * y + 1];
        if (highlight) {
            element.classList.add("sensfloor-display-highlighted-pad");
        } else {
            element.classList.remove("sensfloor-display-highlighted-pad");
        }
    }
</script>

<div class="sensfloor-display" style="--rows: {SensFloor.getDimension().x}; --columns: {SensFloor.getDimension().y}">
    {#each { length: SensFloor.getDimension().x } as _, x}
        {#each { length: SensFloor.getDimension().y } as _, y}
            <div bind:this={elements[x + 1 * y + 1]} class="sensfloor-display-pad"></div>
        {/each}
    {/each}
</div>

<style>
    .sensfloor-display {
        position: relative;
        width: 480px;
        height: 270px;
        display: grid;
        grid-template-rows: repeat(var(--rows), 1fr);
        grid-template-columns: repeat(var(--columns), 1fr);
        background-color: transparent;
        outline: solid;
    }

    .sensfloor-display-pad {
        outline: solid;
    }

    :global(.sensfloor-display-highlighted-pad) {
        background-color: red;
    }
</style>
