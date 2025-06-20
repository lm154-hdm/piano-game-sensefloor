<script lang="ts">
    import { onMount } from "svelte";
    import * as Tone from "tone";

    let { key, pressKey } = $props();

    let synth: Tone.Synth;

    onMount(() => {
        synth = new Tone.Synth().toDestination();
    });

    function play(): void {
        synth.triggerAttackRelease(key, "4n");
        pressKey();
    }
</script>

<button class="piano-key" onclick={play}>
    {key}
</button>

<style>
    .piano-key {
        width: var(--button-width);
        aspect-ratio: 1 / 1;
        font-size: 30px;
        font-weight: bold;
        background-color: var(--secondary);
        color: var(--text-dark);
        border-radius:5%;
        border: 2px solid var(--background-color);
    }
</style>
