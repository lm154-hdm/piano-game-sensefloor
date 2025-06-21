<script lang="ts">
    import { onMount } from "svelte";
    import * as Tone from "tone";

    import * as Animation from "$lib/backend/animation.svelte";
    import {Mode, settings} from "$lib/backend/settings.svelte";
    import {animationIsRunning} from "$lib/backend/animation.svelte";
    import {colors, keys, score} from "$lib/backend/ui-state.svelte";
    import piano from "$lib/PianoSampler";

    let { keyName, color}: { keyName: string, color: string }  = $props();

    let synth: Tone.Synth;

    onMount(() => {
        synth = new Tone.Synth().toDestination();
    });

    function play(): void {
        let duration: number = 0;
        const nextNote = Animation.getNextNote();  // gets actual reference
        if (nextNote && keyName === nextNote.name) {
            duration = nextNote.duration;
        }
        // Continue Animation
        if (settings.mode === Mode.Pause
            && !animationIsRunning
            && keyName == Animation.getNextNote()?.name) {
            Animation.start();
        }
        // Reset color of previous clicked key
        const previousColoredKey = keys.find(k => k.color !== "white"); // default key color
        if (previousColoredKey && previousColoredKey.name !== keyName) {
            previousColoredKey.color = 'white';
        }
        // Set color of key & note
        const key = keys.find(k => k.name === keyName)!;
        console.log(key.color)
        if (nextNote
            && key.name === nextNote.name
            && !nextNote.wasHit) {
            nextNote.color = colors.correctNote;
            nextNote.wasHit = true;
            key.color = colors.correctNote;
            score.correctlyPressed++;
            score.totalCount++;
            Tone.getContext().lookAhead = 0;
            piano.triggerAttackRelease(keyName, duration == 0 ? "4n" : duration);
        } else {
            key.color = colors.falseNote;
            score.totalCount++;
            piano.triggerAttackRelease("C2", duration == 0 ? "4n" : duration,  Tone.now(), 2);
        }

    }
</script>

<button class="piano-key" style="--color: {color}" onclick={play}>
    {keyName}
</button>

<style>
    .piano-key {
        width: var(--button-width);
        aspect-ratio: 1 / 1;
        font-size: 30px;
        font-weight: bold;
        /*background-color: var(--secondary);*/
        background-color: var(--color);
        color: var(--text-dark);
        border-radius:5%;
        border: 2px solid var(--background-color);
    }
</style>
