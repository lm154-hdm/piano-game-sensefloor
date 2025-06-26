<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import { Midi, Track } from "@tonejs/midi";
    import {onDestroy, onMount} from "svelte";
    import { invoke } from "@tauri-apps/api/core";
    import BackButton from "$lib/components/back-button.svelte";
    import Title from "$lib/components/title.svelte";
    import * as Dialog from "@tauri-apps/plugin-dialog";
    import * as Path from "@tauri-apps/api/path";
    import * as Tone from "tone";

    // This error is handled inside of the svelte config
    enum PlaybackMode {
        STOPPED,
        RUNNING_SONG,
        RUNNING_TRACK,
    }

    let midi: Midi | undefined = $state();
    let name: string = $state("");

    let isPlaybackRunning: PlaybackMode = PlaybackMode.STOPPED;
    const synth: Tone.PolySynth = new Tone.PolySynth(Tone.Synth).toDestination();

    onMount(async () => {
        if (settings.midiConfig.path) {
            midi = await loadMidiFile();
        }
    });

    async function selectMidiFile(): Promise<void> {
        stopPlayback();

        const path = await Dialog.open({
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

            if (!midi) {
                console.error("Failed to load midi file");
                return;
            }

            for (let i = 0; i < midi.tracks.length; i++) {
                if (midi.tracks[i].notes.length > 0) {
                    settings.midiConfig.trackIndex = i;
                    break;
                }
            }
        }
    }

    async function loadMidiFile(): Promise<Midi | undefined> {
        name = await Path.basename(settings.midiConfig.path);
        const doesFileExist = await invoke<boolean>("does_file_exist", { path: settings.midiConfig.path });

        if (!doesFileExist) {
            console.error("File at path '" + settings.midiConfig.path + "' doesn't exist");
            return undefined;
        }
        const data = await invoke<Uint8Array>("read_binary_file", { path: settings.midiConfig.path });
        const midi = new Midi(data);

        // Set bpm
        const bpm = midi.header.tempos[0].bpm * (settings.speed / 100);
        midi.header.setTempo(bpm);
        Tone.getTransport().bpm.value = bpm;

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

        const track = midi!.tracks[settings.midiConfig.trackIndex];
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

    onDestroy(() => {
        stopPlayback();
    })

    type DisplayTrack = {
        track: Track,
        trackIndex: number,
        displayIndex: number
    }
    const displayTracks: DisplayTrack[] = $derived(midi?.tracks
        .map((track, i) => ({ track, i })) // i = original track index
        .filter(({ track }) => track.notes.length > 0)
        .map(({ track, i }, displayIndex) => ({
            track,
            trackIndex: i, // for settings.midiConfig
            displayIndex: displayIndex + 1
        }))  ?? []);
</script>

<Title text="Adminpanel - Songauswahl" />

<div id="song-selection-container">
    <h2>Wähle die MIDI-Datei, die du spielen möchtest</h2>
    <button class="menu-button primary-button" onclick={selectMidiFile}>
        {name || "Datei auswählen"}
    </button>
    {#if midi}
        <hr />
        <h2>Wähle die MIDI-Spur, die du spielen möchtest</h2>
        <div id="song-selection-track-container">
            {#each displayTracks as { track, trackIndex, displayIndex }}
                <label>
                    <input
                        type="radio"
                        name="track-selection"
                        value={track.name}
                        checked={trackIndex === settings.midiConfig.trackIndex}
                        onchange={() => {
                            stopPlayback();
                            settings.midiConfig.trackIndex = trackIndex;
                        }}
                    />
                    {track.name || `Track ${displayIndex}`}
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
        padding-right: 20px;
    }

    #song-selection-playback-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>
