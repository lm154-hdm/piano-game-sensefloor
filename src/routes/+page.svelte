<script lang="ts">
    import { PadPart } from "$lib/backend/sens-floor/pad-part";
    import {
        initialise,
        connect,
        disconnect,
        addStepOnListener,
        addStepOffListener,
    } from "$lib/backend/sens-floor/sens-floor";
    import { onMount, onDestroy } from "svelte";
    import * as Tone from "tone";
    import piano from "$lib/PianoSampler";

    let synth: Tone.Synth<Tone.SynthOptions>;

    onMount(async () => {
        synth = new Tone.Synth().toDestination();

        initialise(8, 6);
        Tone.loaded().then(() => {
            addStepOnListener((x: number, y: number, part: PadPart) => {
                console.log(
                    `Stepped on pad (${x}|${y}), part ${PadPart[part]}`,
                );
                play(x, y, true);
            });
            addStepOffListener((x: number, y: number, part: PadPart) => {
                console.log(
                    `Stepped off pad (${x}|${y}), part ${PadPart[part]}`,
                );
                play(x, y, false);
            });
            console.log("added listeners");
        });

        connect("192.168.178.22", 8000);
    });

    onDestroy(() => {
        disconnect();
    });

    function play(pitch: number, key: number, startTone: boolean): void {
        let tone: string = "C";
        switch (key) {
            case 1:
                tone = "C" + (pitch + 1);
                break;
            case 2:
                tone = "D" + (pitch + 1);
                break;
            case 3:
                tone = "E" + (pitch + 1);
                break;
            case 4:
                tone = "F" + (pitch + 1);
                break;
            case 5:
                tone = "G" + (pitch + 1);
                break;
            case 6:
                tone = "A" + (pitch + 1);
                break;
        }

        if (startTone) {
            piano.triggerAttack(tone);
        } else {
            piano.triggerRelease(tone);
        }
    }
</script>
