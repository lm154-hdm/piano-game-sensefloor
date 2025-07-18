<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import * as Tone from "tone";
    import * as Animation from "$lib/backend/animation.svelte";
    import AnimatedKey from "$lib/components/animated-key.svelte";
    import PianoKey from "$lib/components/piano-key.svelte";
    import {Mode, settings} from "$lib/backend/settings.svelte";
    import {Midi} from "@tonejs/midi";
    import piano from "$lib/PianoSampler";
    import {invoke} from "@tauri-apps/api/core";
    import {score} from "$lib/backend/score.svelte";
    import {values} from "$lib/backend/values.svelte";
    import {goto} from "$app/navigation";

    let animationContainerHeight: number = $state(0);

    onMount(async () => {
        window.addEventListener("keydown", onKeyDown);
        const midi = await loadMidi();
        // Reset Score
        score.totalNotes = midi.tracks[settings.midiConfig.trackIndex].notes.length;
        score.incorrectlyPressed = 0;
        score.correctlyPressed = 0;
        if (!(await Animation.initialise(values.playAreaHeight, animationContainerHeight, midi))) {
            console.error("Failed to initialise game because failed to load midi file");
            return;
        }
        const delay = animationContainerHeight / Animation.getAnimationSpeed();
        if (settings.mode === Mode.Playback) {
            scheduleSong(midi, delay, true);
        } /*else if (settings.mode === Mode.Normal) {
            scheduleSong(midi, delay, false);
        }*/
        Animation.start();
        /*|| settings.mode === Mode.Normal*/
        if (settings.mode === Mode.Playback) {
            Tone.getTransport().start();
        }
    });

    onDestroy(() => {
        window.removeEventListener("keydown", onKeyDown);
        Animation.stop();
        Animation.reset();
        Tone.getTransport().stop();
        Tone.getTransport().cancel();
        Tone.getTransport().position = 0;
    });

    async function loadMidi(): Promise<Midi> {
        let midi: Midi;

        if (settings.midiConfig.path) {
            const data = await invoke<Uint8Array>("read_binary_file", { path: settings.midiConfig.path });
            midi = new Midi(data);
        }
        else {
            const res = await fetch("/tetris.mid");
            const data = await res.arrayBuffer();
            midi = new Midi(data);
        }

        const bpm = midi.header.tempos[0].bpm * (settings.speed / 100);
        midi.header.setTempo(bpm);
        return midi;
    }

    function scheduleSong(midi: Midi, delay: number, scheduleActiveTrack: boolean) {
        for(let i = 0; i < midi.tracks.length; i++) {
            if (scheduleActiveTrack || i != settings.midiConfig.trackIndex) {
                for (const note of midi.tracks[i].notes) {
                    Tone.getTransport().schedule((time) => {
                        piano.triggerAttackRelease(
                            note.name,
                            note.duration,
                            time + delay,
                            note.velocity - 0.3,
                        );
                    }, note.time);
                }
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
