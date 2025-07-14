<script lang="ts">
    import { onMount } from "svelte";
    import * as Tone from "tone";

    import * as Animation from "$lib/backend/animation.svelte";
    import { Mode, settings } from "$lib/backend/settings.svelte";
    import {animationIsRunning, type NoteData} from "$lib/backend/animation.svelte";
    import { score } from "$lib/backend/score.svelte";
    import piano from "$lib/PianoSampler";

    let { index, text, color }: { index: number; text: string; color: string } = $props();
    let _pressedKey: NoteData | undefined = undefined;
    let synth: Tone.Synth;

    onMount(() => {
        synth = new Tone.Synth().toDestination();
    });

    function play(): void {
            const keyGroup = Animation.keyGroups.find((_, i) => i === index)!;
            const activeNotes: NoteData[] = Animation.getActiveNotes();
            const activeNoteOfKey = activeNotes.filter((n) => n.groupIndex === index).sort((a,b) => b.startTime - a.startTime)?.[0];
            if (activeNoteOfKey) {
                if (!activeNoteOfKey.wasHit) {
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
                    Tone.getDraw().schedule(() => {
                        keyGroup.color = "--primary";
                    }, Tone.now() + durationInSeconds);
                }
            } else {
                keyGroup.color = "--false-note";
                score.incorrectlyPressed++;
                const duration = "4n";
                const durationInSeconds = Tone.Time(duration).toSeconds();
                if (settings.mode !== Mode.Playback) {
                    piano.triggerAttackRelease("C2", duration, Tone.now(), 2);
                }
                Tone.getDraw().schedule(() => {
                    keyGroup.color = "--primary";
                }, Tone.now() + durationInSeconds);
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
