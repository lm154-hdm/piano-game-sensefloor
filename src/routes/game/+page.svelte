<script lang="ts">
    import { onMount } from "svelte";
    import { Midi } from "@tonejs/midi";
    import * as Tone from "tone";
    import piano from "../../lib/PianoSampler.js";

    let green: boolean = $state(false);
    let duration = $state<string>("2s"); // Base Speed: 700px in 2s = 350px / s
    let durationInMs = $state("2000");
    let duration2 = $state("0.28571428571s"); // 100 / 350 = 0.28571428571
    let started = $state(false);

    let notes = $state<[{ delay: number; left: number; height: number }]>([]); // delay, left
    let keys = $state<[{ name: string; position: [number, number] }]>([]); // name, position (carpet)

    let myMap: Map<string, number> = new Map([
        ["C4", 1],
        ["D4", 2],
        ["E4", 3],
        ["F#4", 4],
        ["G4", 5],
        ["A4", 6],
        ["B4", 7],
    ]);

    let synth;

    onMount(() => {
        for (const key of myMap.keys()) {
            keys.push({ name: key, position: [1, 6 - myMap.get(key) + 1] });
        }
    });

    async function start() {
        await Tone.start();
        const res = await fetch("AlleMeineEntchen.mid");
        const data = await res.arrayBuffer();
        const midi = new Midi(data);
        console.log(midi)
        /*midi.header.setTempo(180);
        const secondsPerQuarter = 60 / midi.header.tempos[0].bpm;*/
        // 180 w ppq 384
        // 90 --> 384

        const bpm = 180;
        midi.header.setTempo(bpm);
        const beatsPerBar = midi.header.timeSignatures[0].timeSignature[0];
        console.log(beatsPerBar)
        const timeFor1Beat = 60 / bpm;
        console.log(timeFor1Beat)
        const timeFor2Bars = 2 * beatsPerBar * timeFor1Beat;
        console.log(timeFor2Bars)

        const speedInPixelsPerSecond = 700 / timeFor2Bars;


        duration = timeFor2Bars + "s";
        durationInMs = timeFor2Bars * 1000;

        console.log(duration)

        const firstNoteTime = midi.tracks[1].notes[0].time;
        midi.tracks.forEach((track) => {
            track.notes.forEach((note) => {
                /*console.log((note.duration / secondsPerQuarter), note.bars);*/
                duration2 = (note.duration * 250) / speedInPixelsPerSecond;
                const animationDelay = note.time - firstNoteTime;
                notes.push({
                    delay: animationDelay,
                    height: note.duration * 250,
                    left: myMap.get(note.name) - 1,
                });
                Tone.Transport.schedule((time) => {
                    // time = When your scheduled event fires
                    piano.triggerAttackRelease(
                        note.name,
                        note.duration,
                        time, // + now ?
                        note.velocity - 0.3,
                    );
                }, note.time);
            });
        });
        const startDelay = parseInt(durationInMs) - (firstNoteTime * 1000); // 0.95s - 0.5s
        started = true;
        setTimeout(() => {
            Tone.Transport.start();
        }, startDelay);
    }

    function playNote(name: string) {
        green = true;

        // TODO: Vergleiche Tone.now() mit schedule(time)

        piano.triggerAttackRelease(
            name,
            0.2382812500000001, // duration = time of how long button is pressed
            Tone.now(),
            0.6692913385826772, // get velocity from MIDI / set your own
        );
    }
</script>

<div style="width: 100%; background-color: wheat; padding: 20px;">
    <div
        style="border: 1px solid black; height: 700px; position: relative; display: flex; overflow: hidden"
    >
        {#if started}
            {#each notes as note, index}
                <div
                    class={["note", { green }]}
                    style="
                     --duration: {duration};
                     --duration2: {note.height / 250}s;
                     --delay: {note.delay}s;
                     --delay2: {note.delay + durationInMs / 1000}s;
                     --left: {note.left * 100}px;
                     --height: {note.height}px;"
                >
                    {note.left * 100}px;
                </div>
            {/each}
        {/if}
    </div>
    <!-- padding-left: 42px; -->
    <div
        style="display: flex; border: 1px solid red;"
    >
        {#each keys as key, index}
            <button id="key" onclick={() => playNote(key.name)}
                >{key.name}</button
            >
        {/each}
    </div>

    <div style="display: flex;">
        <button onclick={start} style="margin: 60px 20px 20px 20px"
            >Start</button
        >
        <button
            onclick={() => {
                Tone.Transport.stop();
            }}
            style="margin: 60px 20px 20px 20px">Stop</button
        >
    </div>
</div>

<style>
    .note {
        background-color: white;
        height: var(--height, 40px);
        top: calc(var(--height, 40px) * -1);
        width: 100px;

        position: absolute;
        left: var(--left);

        animation:
            moveDown var(--duration) linear var(--delay) 1,
            moveDown2 var(--duration2) linear var(--delay2) 1; /*, moveDown2 var(--duration2) linear 2s 10*/

        transition: background-color 0.5s;
    }

    .green {
        background-color: green;
    }

    #key {
        height: 100px;
        width: 100px;
        position: relative;
    }

    @keyframes moveDown {
        0% {
            top: calc(var(--height, 40px) * -1);
        }
        100% {
            top: calc(100% - (var(--height, 40px)));
        }
    }

    @keyframes moveDown2 {
        0% {
            top: calc(100% - (var(--height, 40px)));
        }
        100% {
            top: calc(100%);
        }
    }
</style>
