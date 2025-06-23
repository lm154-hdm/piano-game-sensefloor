<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import Title from "$lib/components/title.svelte";
    import { Midi } from "@tonejs/midi";
    import * as dialog from "@tauri-apps/plugin-dialog";
    import * as fs from "@tauri-apps/plugin-fs";
    import * as Tone from "tone";
    import { onMount } from "svelte";

    // This error is handled inside of the svelte config
    enum PlaybackMode {
        STOPPED,
        RUNNING_SONG,
        RUNNING_TRACK,
    }

    let midi: Midi | undefined = $state();
    let trackIndex: number = $state(0);

    let isPlaybackRunning: PlaybackMode = PlaybackMode.STOPPED;
    const synth: Tone.PolySynth = new Tone.PolySynth(Tone.Synth).toDestination();

    onMount(
        /*async */ () => {
            console.log("Mount");
            /*if (settings.midiConfig.path) {
            console.log("lkasd");
            midi = await loadMidiFile();
            trackIndex = settings.midiConfig.trackIndex;
            }*/
        },
    );

    async function selectMidiFile(): Promise<void> {
        stopPlayback();

        const path = await dialog.open({
            multiple: false,
            filters: [
                {
                    name: "MIDI-Datei",
                    extensions: ["mid", "midi"],
                },
            ],
        });

        if (path) {
            if (path === settings.midiConfig.path) {
                console.log("Trying to load the same midi file that is already loaded, aborting");
                return;
            }

            settings.midiConfig.path = path;
            midi = await loadMidiFile();
            trackIndex = 0;
        }
    }

    async function loadMidiFile(): Promise<Midi | undefined> {
        console.log("Test");

        const doesFileExist = await fs.exists(settings.midiConfig.path);
        if (!doesFileExist) {
            console.error("File at path '" + settings.midiConfig.path + "' does't exist");
            return;
        }

        console.log("Test2");

        const data = await fs.readFile(settings.midiConfig.path);
        const midi = new Midi(data);

        // Set bpm
        //const bpm = midi.header.tempos[0].bpm * (settings.speed / 100);
        //midi.header.setTempo(bpm);
        //Tone.getTransport().bpm.value = bpm;

        return midi;
    }

    async function playSong() {
        if (isPlaybackRunning === PlaybackMode.RUNNING_SONG) {
            return;
        }

        stop();

        await Tone.start();

        for (const track of midi!.tracks) {
            for (const note of track.notes) {
                Tone.getTransport().schedule((time) => {
                    synth.triggerAttackRelease(note.name, note.duration, time);
                }, note.time);
            }
        }
        Tone.getTransport().start();

        isPlaybackRunning = PlaybackMode.RUNNING_SONG;
    }

    async function playTrack() {
        if (isPlaybackRunning === PlaybackMode.RUNNING_TRACK) {
            return;
        }

        stop();

        await Tone.start();

        const track = midi!.tracks[trackIndex];
        for (const note of track.notes) {
            Tone.getTransport().schedule((time) => {
                synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
            }, note.time);
        }
        Tone.getTransport().start();

        isPlaybackRunning = PlaybackMode.RUNNING_TRACK;
    }

    function stopPlayback() {
        Tone.getTransport().stop();
        Tone.getTransport().cancel();
        Tone.getTransport().position = 0;
        isPlaybackRunning = PlaybackMode.STOPPED;
    }
</script>

<Title text="Adminpanel - Songauswahl" />

<div id="song-selection-container">
    <h2>Wähle die MIDI-Datei, die du spielen möchtest</h2>
    <button class="menu-button primary-button" onclick={selectMidiFile}>
        {midi?.name || "Datei auswählen"}
    </button>
    {#if midi}
        <hr />
        <h2>Wähle die MIDI-Spur, die du spielen möchtest</h2>
        <div id="song-selection-track-container">
            {#each midi.tracks as track, i}
                <label>
                    <input
                        type="radio"
                        name="track-selection"
                        value={track.name}
                        checked={i === trackIndex}
                        onchange={() => {
                            stopPlayback();
                            trackIndex = i;
                        }}
                    />
                    {track.name || "UNNAMED"}
                </label>
            {/each}
        </div>
        <hr />
        <div id="song-selection-playback-container">
            <button class="menu-button primary-button" onclick={playSong}>Gesamten Song abspielen</button>
            <button class="menu-button primary-button" onclick={playTrack}>Ausgewählte MIDI-Spur abspielen</button>
            <button class="menu-button primary-button" onclick={stopPlayback}>Abspielen stoppen</button>
        </div>
    {/if}
</div>

<!-- TODO: Stop playback when clicking on this button --> --
<BackButton text="Speichern und zurück" slug="/admin" shouldSave={true} />

<style>
    button {
        width: auto;
        height: auto;
    }

    hr {
        width: 80%;
    }

    #song-selection-container {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        color: var(--text);
    }

    #song-selection-track-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        overflow-y: scroll;
    }

    #song-selection-playback-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>
