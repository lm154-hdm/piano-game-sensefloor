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
        getDimension,
    } from "$lib/backend/sens-floor/sens-floor";
    import { Midi } from "@tonejs/midi";
    import { onMount, onDestroy } from "svelte";
    import { settings } from "$lib/backend/settings.svelte";
    import * as Tone from "tone";
    import AnimatedKey from "$lib/components/animated-key.svelte";
    import PianoKey from "$lib/components/piano-key.svelte";

    type NoteData = {
        width: number;
        height: number;
        top: number;
        left: number;
        startTime: number;
        animationState: number;
    };

    // We need to do the animation state with an object like this because enums are discouraged in .svelte files
    const animationState = {
        none: 0,
        running: 1,
        finished: 2,
    };

    let time: number = 0;
    let animationSpeed: number = 0;
    let notes: NoteData[] = [];
    let previousTime = performance.now();

    let windowWidth: number = $state(-1);
    let windowHeight: number = $state(-1);
    let animationContainerHeight: number = $state(0);
    let renderedNotes: NoteData[] = $state([]);
    let secondsPerBar: number = $state(0);

    const keys: string[] = ["D4", "E4", "F#4", "G4", "A4", "B4"];

    onMount(async () => {
        initialise(8, 6);
        Tone.loaded().then(() => {
            addStepOnListener((event: StepEventData) => {
                clickAtPosition(event.normalisedX * windowWidth, event.normalisedY * windowHeight);
            });
            addStepOffListener((event: StepEventData) => {
                console.log(`Stepped off pad (${event.padX} | ${event.padY}) part: ${PadPart[event.padPart]}`);
            });
            console.log("added listeners");
        });

        connect("192.168.178.22", 8000);

        if (!(await loadMidiFile("AlleMeineEntchen.mid"))) {
            console.error("Failed to intialise game because failed to load midi file");
            return;
        }
    });

    onDestroy(() => {
        removeAllListeners();
        disconnect();
    });

    $effect(() => {
        function loop(currentTime: number): void {
            const deltaTime = (currentTime - previousTime) / 1000;
            previousTime = currentTime;
            time += deltaTime;

            for (const note of renderedNotes) {
                note.top += animationSpeed * deltaTime;
                if (note.top > windowHeight) {
                    note.animationState = animationState.finished;
                    renderedNotes.splice(renderedNotes.indexOf(note), 1);
                }
            }

            for (const note of notes) {
                if (note.startTime <= time && note.animationState === animationState.none) {
                    note.top += animationSpeed * (time - note.startTime); // Move note down by potential delay because of discrete timesteps
                    note.animationState = animationState.running;
                    renderedNotes.push(note);
                }
            }

            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    });

    function clickAtPosition(x: number, y: number): void {
        const element: HTMLButtonElement = document.elementFromPoint(x, y) as HTMLButtonElement;
        if (element) {
            element.click();
        }
    }

    async function loadMidiFile(path: string): Promise<boolean> {
        const res = await fetch(path);
        if (!res) {
            console.error("Failed to fetch midi file", path);
            return false;
        }
        const data = await res.arrayBuffer();
        const midi = new Midi(data);

        midi.header.setTempo(settings.bpm);

        const beatsPerBar = midi.header.timeSignatures[0].timeSignature[0];
        const secondsPerBeat = 60 / settings.bpm;
        secondsPerBar = beatsPerBar * secondsPerBeat;
        animationSpeed = animationContainerHeight / secondsPerBar;

        const track = midi.tracks[1];
        const trackDelay = track.notes[0].time;
        const noteWidth = windowWidth / getDimension().x;
        for (const note of track.notes) {
            const height = note.duration * animationSpeed;
            notes.push({
                width: noteWidth,
                height: height,
                top: -height,
                left: keys.indexOf(note.name) * noteWidth, // Currently hardcoded to 6 keys, need a mapping system later on
                startTime: note.time - trackDelay, // Subtract start time of first note to make it start immediately
                animationState: animationState.none,
            });
        }

        return true;
    }
</script>

<main bind:clientWidth={windowWidth} bind:clientHeight={windowHeight}>
    <div bind:clientHeight={animationContainerHeight} class="animated-container">
        {#each renderedNotes as note}
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
    }
</style>
