<script lang="ts">
    import * as Tone from "tone";

    import * as Animation from "$lib/backend/animation.svelte";
    import { Mode, settings } from "$lib/backend/settings.svelte";
    import {animationIsRunning, type NoteData} from "$lib/backend/animation.svelte";
    import { score } from "$lib/backend/score.svelte";
    import piano from "$lib/PianoSampler";

    let { index, text, color }: { index: number; text: string; color: string } = $props();

    let resetCorrectColorTimeout: number | undefined = undefined;
    let resetIncorrectColourTimeout: number | undefined = undefined;


    function play(): void {
        const keyGroup = Animation.keyGroups.find((_, i) => i === index)!;
        const activeNotes: NoteData[] = Animation.getActiveNotes(); // sorted asc. by startTime
        const activeNoteOfKey = activeNotes.find((n) => n.groupIndex === index && !n.wasHit);
        if (activeNoteOfKey) {
            Animation.hitNote(activeNoteOfKey.id)
            keyGroup.color = "--correct-note";
            score.correctlyPressed++;
            const duration = activeNoteOfKey.duration == 0 ? "4n" : activeNoteOfKey.duration;
            const durationInSeconds = Tone.Time(duration).toSeconds();
            if (settings.mode !== Mode.Playback) {
                piano.triggerAttackRelease(activeNoteOfKey.name, duration);
            }
            if (settings.mode === Mode.Pause && !animationIsRunning) {
                Animation.start();
            }
            if (resetCorrectColorTimeout !== undefined) {
                clearTimeout(resetCorrectColorTimeout);
            }
            resetCorrectColorTimeout = setTimeout(() => {
                keyGroup.color = "--primary";
            }, durationInSeconds * 1000);
        } else {
            keyGroup.color = "--false-note";
            score.incorrectlyPressed++;
            const duration = "4n";
            const durationInSeconds = Tone.Time(duration).toSeconds();
            if (settings.mode !== Mode.Playback) {
                piano.triggerAttackRelease("C2", duration, Tone.now(), 2);
            }
            if (resetIncorrectColourTimeout !== undefined) {
                clearTimeout(resetIncorrectColourTimeout);
            }
            resetIncorrectColourTimeout = setTimeout(() => {
                keyGroup.color = "--primary";
            }, durationInSeconds * 1000);
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
