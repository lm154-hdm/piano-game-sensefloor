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
        const nextNote = Animation.getNextNote(); // gets actual reference
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
        if (nextNote && nextNote.groupIndex === index && !nextNote.wasHit) {
            nextNote.color = "--correct-note";
            nextNote.wasHit = true;
            keyGroup.color = "--correct-note";
            score.correctlyPressed++;
            if (settings.mode !== Mode.Playback) {
                piano.triggerAttackRelease(nextNote.name, nextNote.duration == 0 ? "4n" : nextNote.duration);
            }
        } else {
            keyGroup.color = "--false-note";
            score.incorrectlyPressed++;
            if (settings.mode !== Mode.Playback) {
                piano.triggerAttackRelease("C2", "4n", Tone.now(), 2);
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
