<script lang="ts">
    import "../app.css";

    const { children } = $props();

    /*import { load, settings } from "$lib/backend/settings.svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { onMount } from "svelte";
    import * as Tone from "tone";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";

    const { children } = $props();

    let windowWidth: number = $state(-1);
    let windowHeight: number = $state(-1);

    onMount(async () => {
        const window = getCurrentWindow();
        await window.show();
        await window.setFullscreen(true);
        await window.setFocus();

        await load();
        await Tone.loaded();
        Tone.getContext().lookAhead = 0;

        SensFloor.initialise(8, 6);
        SensFloor.connect("192.168.178.22", 8000);

        SensFloor.addStepOnListener((event: SensFloor.StepEventData) => {
            const x = event.normalisedX * windowWidth * settings.sensFloorConfig.scaleX;
            const y = event.normalisedY * windowHeight * settings.sensFloorConfig.scaleY;
            clickAtPosition(x, y);
        });
    });

    function clickAtPosition(x: number, y: number): void {
        const element: HTMLButtonElement = document.elementFromPoint(x, y) as HTMLButtonElement;
        if (element) {
            element.click();
        }
    }*/
</script>

{@render children()}

<!--
<main>
    <div id="application-container" bind:clientWidth={windowWidth} bind:clientHeight={windowHeight}>
        {@render children()}
    </div>
</main>
-->

<style>
    /*main {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: var(--crop-left);
        width: calc(100vw - var(--crop-left) - var(--crop-right));
        height: 100vh;
    }

    #application-container {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: var(--background-color);
    }*/
</style>
