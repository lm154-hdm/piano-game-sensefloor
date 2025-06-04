<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as Tone from "tone";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";
    import * as Animation from "$lib/backend/animation.svelte";
    import AnimatedKey from "$lib/components/animated-key.svelte";
    import PianoKey from "$lib/components/piano-key.svelte";

    let windowWidth: number = $state(-1);
    let windowHeight: number = $state(-1);
    let animationContainerHeight: number = $state(0);

    const keys: string[] = ["D4", "E4", "F#4", "G4", "A4", "B4"];

    onMount(async () => {
        SensFloor.initialise(8, 6);
        SensFloor.connect("192.168.178.22", 8000);

        if (!(await Animation.initialise(keys, windowWidth, windowHeight, animationContainerHeight))) {
            console.error("Failed to initialise game because failed to load midi file");
            return;
        }

        Tone.loaded().then(() => {
            SensFloor.addStepOnListener((event: SensFloor.StepEventData) => {
                clickAtPosition(event.normalisedX * windowWidth, event.normalisedY * windowHeight);
            });
            console.log("added listeners");
        });

        Animation.start();
    });

    onDestroy(() => {
        SensFloor.removeAllListeners();
        SensFloor.disconnect();
        Animation.stop();
    });

    function clickAtPosition(x: number, y: number): void {
        const element: HTMLButtonElement = document.elementFromPoint(x, y) as HTMLButtonElement;
        if (element) {
            element.click();
        }
    }
</script>

<main bind:clientWidth={windowWidth} bind:clientHeight={windowHeight}>
    <div bind:clientHeight={animationContainerHeight} class="animated-container">
        {#each Animation.visibleNotes as note}
            <AnimatedKey width={note.width} height={note.height} top={note.top} left={note.left} />
        {/each}
    </div>
    <div class="piano-container">
        {#each keys as key}
            <PianoKey {key} />
        {/each}
    </div>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-evenly;
        overflow: hidden;
    }

    .animated-container {
        width: 100%;
        flex-grow: 1;
        overflow: hidden;
    }

    .piano-container {
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-evenly;
        z-index: 1;
        padding: 8px;
        gap: 8px;
        background-color: black;
        box-sizing: border-box;
        border-top: 4px solid red;
    }
</style>
