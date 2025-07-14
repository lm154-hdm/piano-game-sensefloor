<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as Tone from "tone";
    import * as Animation from "$lib/backend/animation.svelte";
    import AnimatedKey from "$lib/components/animated-key.svelte";
    import PianoKey from "$lib/components/piano-key.svelte";
    import { Mode, settings } from "$lib/backend/settings.svelte";
    import { Midi } from "@tonejs/midi";
    import piano from "$lib/PianoSampler";
    import { invoke } from "@tauri-apps/api/core";
    import { score } from "$lib/backend/score.svelte";
    import { values } from "$lib/backend/values.svelte";
    import {goto} from "$app/navigation";

    let animationContainerHeight: number = $state(0);

    onMount(async () => {
        window.addEventListener("keydown", onKeyDown);
        const midi = await loadMidi();
        score.totalNotes = midi.tracks[settings.midiConfig.trackIndex].notes.length;

        if (!(await Animation.initialise(values.playAreaHeight, animationContainerHeight, midi))) {
            console.error("Failed to initialise game because failed to load midi file");
            return;
        }

        if (settings.mode === Mode.Playback) {
            schedulePlaybackSong(midi);
        }
        Animation.start();
        if (settings.mode === Mode.Playback) {
            Tone.getTransport().start();
        }
    });

    onDestroy(() => {
        window.removeEventListener("keydown", onKeyDown);
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

    function schedulePlaybackSong(midi: Midi) {
        // TD: use trackNumber of chose track
        for (const track of midi.tracks) {
            if (track.notes.length <= 0) {
                continue;
            }

            const scheduleDelay = animationContainerHeight / Animation.getAnimationSpeed(); // time, that animated note needs to move down to key (set in Animation)
            for (const note of track.notes) {
                Tone.getTransport().schedule((time) => {
                    // time = When your scheduled event fires
                    piano.triggerAttackRelease(
                        note.name,
                        note.duration,
                        time + scheduleDelay, // + now ?
                        note.velocity - 0.3,
                    );
                }, note.time);
            }
        }
    }

    function onKeyDown(event: KeyboardEvent): void {
        if (event.key === "1") {
            goto("/sensfloor/menu");
        }
    }

</script>

<div class="prototype-container stretch-playarea">
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
        /*width: 100vw;
        height: 100vh;*/
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
