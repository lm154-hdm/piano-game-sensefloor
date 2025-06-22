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
    import {keys} from "$lib/backend/ui-state.svelte";

    let windowWidth: number = $state(-1);
    let windowHeight: number = $state(-1);
    let animationContainerHeight: number = $state(0);

    onMount(async () => {
        Tone.getContext().lookAhead = 0;
        SensFloor.initialise(8, 6);
        SensFloor.connect("192.168.178.22", 8000);

        const midi = await loadMidi(settings.midiFilePath);

        if (!(await Animation.initialise(keys.map(k => k.name), windowHeight, animationContainerHeight, midi))) {
            console.error("Failed to initialise game because failed to load midi file");
            return;
        }

        Tone.loaded().then(() => {
            SensFloor.addStepOnListener((event: SensFloor.StepEventData) => {
                const x = event.normalisedX * windowWidth * settings.sensFloorConfig.scaleX;
                const y = event.normalisedY * windowHeight * settings.sensFloorConfig.scaleY;
                clickAtPosition(x, y);
            });
        });

        scheduleSong(midi);
        Animation.start();
        if (settings.mode === Mode.Playback) {
            Tone.getTransport().start();
        }
    });

    onDestroy(() => {
        SensFloor.removeAllListeners();
        SensFloor.disconnect();
        Animation.stop();
        Animation.reset(); // doesn't work properly
        Tone.getTransport().stop();
        Tone.getTransport().cancel();  // works
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
        const bpm = midi.header.tempos[0].bpm * (settings.speed / 100);
        midi.header.setTempo(bpm);
        return midi;
    }

    function scheduleSong(midi: Midi) {
        // TD: use trackNumber of chose track
        midi.tracks.forEach((track) => {
            //score.totalCount = track.notes.length;
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
    }

</script>

<div bind:clientWidth={windowWidth} bind:clientHeight={windowHeight} class="prototype-container">
    <div bind:clientHeight={animationContainerHeight} class="animated-container">
        {#each Animation.notes as note}
            <AnimatedKey height={note.height} top={note.top} left={note.left} color={note.color} />
        {/each}
    </div>
    <div class="piano-container">
        {#each keys as key}
            <PianoKey keyName={key.name} color={key.color} />
        {/each}
    </div>
</div>

<style>
    .prototype-container {
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
        height: fit-content;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-evenly;
        z-index: 1;
        padding: 8px;
        gap: 8px;
        background-color: black;
        box-sizing: border-box;
        border-top: 4px solid var(--accent);
    }
</style>
