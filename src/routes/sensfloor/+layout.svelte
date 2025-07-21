<script lang="ts">
    import { values } from "$lib/backend/values.svelte";
    import { onDestroy, onMount } from "svelte";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";

    const { children } = $props();

    onMount(async () => {
        const config = SensFloor.getConfig();
        await SensFloor.connect(config.offsetLeft, config.offsetRight, config.offsetTop, config.offsetBottom);
        SensFloor.registerStepOnListener(stepOnListener);
    });

    onDestroy(() => {
        SensFloor.unregisterStepOnListener(stepOnListener);
        SensFloor.disconnect();
    });

    function stepOnListener(event: SensFloor.StepEventData): void {
        const config = SensFloor.getConfig();
        const x = event.normalisedX * values.playAreaWidth + config.cropLeft;
        const y = event.normalisedY * values.playAreaHeight + config.cropBottom;

        const element: HTMLButtonElement = document.elementFromPoint(x, y) as HTMLButtonElement;

        if (element) {
            element.click();
        }
    }
</script>

<main class="stretch-screen flex-center flex-row">
    <div bind:clientWidth={values.playAreaWidth} bind:clientHeight={values.playAreaHeight} id="playarea" class="flex-bottom flex-row">
        {@render children()}
    </div>
</main>

<style>
    #playarea {
        position: relative;
        width: calc(100vw - var(--crop-left) - var(--crop-right));
        height: calc(100vh - var(--crop-top) - var(--crop-bottom));
    }
</style>
