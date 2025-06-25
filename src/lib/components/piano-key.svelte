<script lang="ts">
    import { onMount } from "svelte";
    import * as Tone from "tone";

    import * as Animation from "$lib/backend/animation.svelte";
    import { Mode, settings } from "$lib/backend/settings.svelte";
    import { animationIsRunning } from "$lib/backend/animation.svelte";
    import { score } from "$lib/backend/score.svelte";
    import piano from "$lib/PianoSampler";

    let { index, text, color }: { index: number; text: string; color: string } = $props();

    let synth: Tone.Synth;

    onMount(() => {
        synth = new Tone.Synth().toDestination();
    });

    function play(): void {
        let duration: number = 0;
        const nextNote = Animation.getNextNote(); // gets actual reference
        if (nextNote && index === nextNote.groupIndex) {
            duration = nextNote.duration;
        }
        // Continue Animation
        if (settings.mode === Mode.Pause && !animationIsRunning && index === nextNote?.groupIndex) {
            Animation.start();
        }
        // Reset color of previous clicked key
        const previousColoredPianoKey = Animation.keyGroups.find((keyGroup) => keyGroup.color !== "--primary"); // default key color
        if (previousColoredPianoKey && Animation.keyGroups.indexOf(previousColoredPianoKey) !== index) {
            previousColoredPianoKey.color = "--primary";
        }
        // Set color of key & note
        const keyGroup = Animation.keyGroups.find((_, i) => i === index)!;
        if (nextNote && nextNote.groupIndex === Animation.keyGroups.indexOf(keyGroup) && !nextNote.wasHit) {
            nextNote.color = "--correct-note";
            nextNote.wasHit = true;
            keyGroup.color = "--correct-note";
            score.correctlyPressed++;
            score.totalPressed++;
            if (settings.mode !== Mode.Playback) {
                piano.triggerAttackRelease(nextNote.name, duration == 0 ? "4n" : duration);
            }
        } else {
            keyGroup.color = "--false-note";
            score.totalPressed++;
            if (settings.mode !== Mode.Playback) {
                piano.triggerAttackRelease("C2", duration == 0 ? "4n" : duration, Tone.now(), 2);
            }
        }
    }
</script>

<button class="menu-button piano-key" style="--color: var({color})" onclick={play}>
    {text}
</button>

<style>
    button {
        width: var(--button-width);
        height: var(--button-width);
        background-color: var(--color);
        color: var(--text-dark);
    }
</style>
