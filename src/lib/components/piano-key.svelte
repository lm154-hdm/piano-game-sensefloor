<script lang="ts">
    import { onMount } from "svelte";
    import * as Tone from "tone";

    import {activeNote, visibleNotes} from "$lib/backend/animation.svelte";
    import * as Animation from "$lib/backend/animation.svelte";
    import {keys} from "$lib/backend/ui-state.svelte";

    let { keyName, color, pressKey }: { keyName: string, color: string, pressKey: () => void }  = $props();

    let synth: Tone.Synth;

    onMount(() => {
        synth = new Tone.Synth().toDestination();
    });

    function play(): void {
        let duration: number = 0;

        const nextNote = Animation.getNextNote();
        if (nextNote && keyName === nextNote.name) {
            duration = nextNote.duration;
        }
        synth.triggerAttackRelease(keyName, duration == 0 ? "4n" : duration);



        pressKey();
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
        background-color: var(--color);
        /*border: 5px solid var(--color, gray);
        background-color: transparent;*/
    }
</style>
