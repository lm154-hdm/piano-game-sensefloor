<script lang="ts">
    import { onMount } from "svelte";
    import * as Tone from "tone";

    import * as Animation from "$lib/backend/animation.svelte";

    let { keyName, color, pressKey }: { keyName: string, color: string, pressKey: () => void }  = $props();

    let synth: Tone.Synth;

    onMount(() => {
        synth = new Tone.Synth().toDestination();
    });

    function play(): void {
        let duration: number = 0;
        // für playback mode ?
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
        /*background-color: var(--secondary);*/
        background-color: var(--color);
        color: var(--text-dark);
        border-radius:5%;
        border: 2px solid var(--background-color);
    }
</style>
