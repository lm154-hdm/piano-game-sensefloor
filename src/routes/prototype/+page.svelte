<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as Tone from "tone";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";
    import * as Animation from "$lib/backend/animation.svelte";
    import AnimatedKey from "$lib/components/animated-key.svelte";
    import PianoKey from "$lib/components/piano-key.svelte";
    import { Mode, settings } from "$lib/backend/settings.svelte";
    import { Midi } from "@tonejs/midi";
    import piano from "$lib/PianoSampler";
    import { invoke } from "@tauri-apps/api/core";

    let windowWidth: number = $state(-1);
    let windowHeight: number = $state(-1);
    let animationContainerHeight: number = $state(0);

    onMount(async () => {
        SensFloor.initialise(8, 6);
        SensFloor.connect("192.168.178.22", 8000);

        const midi = await loadMidi();

        if (!(await Animation.initialise(windowHeight, animationContainerHeight, midi))) {
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
        Tone.getTransport().cancel(); // works
    });

    function clickAtPosition(x: number, y: number): void {
        const element: HTMLButtonElement = document.elementFromPoint(x, y) as HTMLButtonElement;
        if (element) {
            element.click();
        }
    }

    async function loadMidi(): Promise<Midi> {
        const data = await invoke<Uint8Array>("read_binary_file", { path: settings.midiConfig.path });
        const midi = new Midi(data);
        const bpm = midi.header.tempos[0].bpm * (settings.speed / 100);
        midi.header.setTempo(bpm);
        return midi;
    }

    function scheduleSong(midi: Midi) {
        // TD: use trackNumber of chose track
        for (const track of midi.tracks) {
            if (track.notes.length <= 0) {
                continue;
            }

            for (const note of track.notes) {
                Tone.getTransport().schedule((time) => {
                    // time = When your scheduled event fires
                    piano.triggerAttackRelease(
                        note.name,
                        note.duration,
                        time, // + now ?
                        note.velocity - 0.3,
                    );
                }, note.time);
            }
        }
    }
</script>

<div bind:clientWidth={windowWidth} bind:clientHeight={windowHeight} class="prototype-container">
    <div bind:offsetHeight={animationContainerHeight} class="animated-container">
        {#each Animation.notes as note}
            <AnimatedKey height={note.height} top={note.top} left={note.left} color={note.color} />
        {/each}
    </div>
    <div class="piano-container">
        {#each Animation.keyGroups as keyGroup, i}
            <PianoKey index={i} text={keyGroup.displayName} color={keyGroup.color} />
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
        height: var(--button-width);
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-evenly;
        z-index: 1;
        background-color: black;
        border-top: 4px solid var(--accent);
    }
</style>
