<script lang="ts">
    import { PadPart } from "$lib/backend/sens-floor/pad-part";
    import {
        initialise,
        connect,
        disconnect,
        addStepOnListener,
        addStepOffListener,
        type StepEventData,
        removeAllListeners,
    } from "$lib/backend/sens-floor/sens-floor";
    import { onMount, onDestroy } from "svelte";
    import piano from "$lib/PianoSampler";
    import * as Tone from "tone";

    let synth: Tone.PolySynth;
    let width: number = -1;
    let height: number = -1;

    const keys: string[] = ["D4", "E4", "F#4", "G4", "A4", "B4"];

    onMount(async () => {
        synth = new Tone.PolySynth().toDestination();

        initialise(8, 6);
        Tone.loaded().then(() => {
            addStepOnListener((event: StepEventData) => {
                clickAtPosition(event.normalisedX * width, event.normalisedY * height);
            });
            addStepOffListener((event: StepEventData) => {
                console.log(`Stepped off pad (${event.padX} | ${event.padY}) part: ${PadPart[event.padPart]}`);
            });
            console.log("added listeners");
        });

        connect("192.168.178.22", 8000);
    });

    onDestroy(() => {
        removeAllListeners();
        disconnect();
    });

    function clickAtPosition(x: number, y: number): void {
        const element: HTMLButtonElement = document.elementFromPoint(x, y) as HTMLButtonElement;
        if (element) {
            element.click();
        }
    }

    function play(key: string): void {
        synth.triggerAttackRelease(key, "4n");
    }
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
    {#each keys as key}
        <button onclick={() => play(key)}>
            {key}
        </button>
    {/each}
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-evenly;
        overflow: hidden;
    }

    button {
        height: 100px;
        flex-grow: 1;
    }
</style>
