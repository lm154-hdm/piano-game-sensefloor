<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as Tone from "tone";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";
    import * as Animation from "$lib/backend/animation.svelte";
    import AnimatedKey from "$lib/components/animated-key.svelte";
    import PianoKey from "$lib/components/piano-key.svelte";
    import {Mode, settings} from "$lib/backend/settings.svelte";
    import {Midi} from "@tonejs/midi";
    import piano from "$lib/PianoSampler";

    let windowWidth: number = $state(-1);
    let windowHeight: number = $state(-1);
    let animationContainerHeight: number = $state(0);

    const keys: string[] = ["D4", "E4", "F#4", "G4", "A4", "B4"];

    onMount(async () => {
        console.log("on mount");
        SensFloor.initialise(8, 6);
        SensFloor.connect("192.168.178.22", 8000);

        const midi = await loadMidi(settings.midiFilePath);

        if (!(await Animation.initialise(keys, windowWidth, windowHeight, animationContainerHeight, midi))) {
            console.error("Failed to initialise game because failed to load midi file");
            return;
        }

        Tone.loaded().then(() => {
            SensFloor.addStepOnListener((event: SensFloor.StepEventData) => {
                const x = event.normalisedX * windowWidth * settings.sensFloorConfig.scaleX;
                const y = event.normalisedY * windowHeight * settings.sensFloorConfig.scaleY;
                clickAtPosition(x, y);
            });
            console.log("added listeners");
        });

        Animation.start();
        if (settings.mode == Mode.Playback) {
            playSong(midi);
        }
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

    async function loadMidi(path: string): Promise<Midi> {
        const res = await fetch(path);
        if (!res) {
            console.error("Failed to fetch midi file", settings.midiFilePath);
        }
        const data = await res.arrayBuffer();
        const midi = new Midi(data);
        midi.header.setTempo(settings.bpm);
        return midi;
    }

    function playSong(midi: Midi) {
        // const firstNoteTime = midi.tracks[1].notes[0].time;
        midi.tracks.forEach((track) => {
            track.notes.forEach((note) => {
                Tone.getTransport().schedule((time) => {
                    // time = When your scheduled event fires
                    piano.triggerAttackRelease(
                        note.name,
                        note.duration,
                        time, // + now ?
                        note.velocity - 0.3,
                    );
                }, note.time);
            });
        });
        Tone.getTransport().start();
        /*const startDelay = parseInt(durationInMs) - firstNoteTime * 1000; // 0.95s - 0.5s
        started = true;
        setTimeout(() => {
            Tone.getTransport().start();
        }, startDelay);*/
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
