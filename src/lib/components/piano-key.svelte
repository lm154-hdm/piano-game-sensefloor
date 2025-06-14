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
        height: 100%;
        flex-grow: 1;
        font-size: 30px;
        font-weight: bold;
    }
</style>
