import {Mode, settings} from "./settings.svelte";
import { Midi } from "@tonejs/midi";

type NoteData = {
    width: number;
    height: number;
    top: number;
    left: number;
    startTime: number;
    animationState: number;
    name: string;
    stopped: boolean;
};

// We need to do the animation state with an object like this because enums are discouraged in .svelte files
const animationState = {
    none: 0,
    running: 1,
    finished: 2,
};

let height: number = 0;
let _animationContainerHeight: number = 0;
let previousTime: number = 0;
let time: number = 0;
let animationSpeed: number = 0;
let frameId: number = 0;
const notes: NoteData[] = [];

export const visibleNotes: NoteData[] = $state([]);
let nextNote = $state("");
export function getNextNote() {
    return nextNote;
}
export let animationIsRunning: boolean = false;

export async function initialise(
    keys: string[],
    windowWidth: number,
    windowHeight: number,
    animationContainerHeight: number,
    midi: Midi
): Promise<boolean> {
    height = windowHeight;
    _animationContainerHeight = animationContainerHeight;

    const beatsPerBar = midi.header.timeSignatures[0].timeSignature[0];
    const secondsPerBeat = 60 / settings.bpm;
    const secondsPerBar = beatsPerBar * secondsPerBeat;
    animationSpeed = animationContainerHeight / secondsPerBar;

    const track = midi.tracks[1];
    const trackDelay = track.notes[0].time;
    //const noteWidth = windowWidth / getDimension().x;
    const noteWidth = windowWidth / 6;
    for (const note of track.notes) {
        const height = note.duration * animationSpeed;
        notes.push({
            width: noteWidth,
            height: height,
            top: -height,
            left: keys.indexOf(note.name) * noteWidth, // Currently hardcoded, need a proper mapping system later on
            startTime: note.time - trackDelay, // Subtract start time of first note to make it start immediately
            animationState: animationState.none,
            name: note.name,
            stopped: false
        });
    }

    return true;
}

export function start(): void {
    previousTime = performance.now();
    frameId = requestAnimationFrame(animationLoop);
    animationIsRunning = true;
}

export function stop(): void {
    cancelAnimationFrame(frameId);
    animationIsRunning = false;
}

export function reset(): void {
    notes.length = 0;
    visibleNotes.length = 0;
}

function animationLoop(currentTime: number): void {
    // Calculate time values
    const deltaTime = (currentTime - previousTime) / 1000.0;
    previousTime = currentTime;
    time += deltaTime;

    // Animate visible keys
    for (const note of visibleNotes) {
        note.top += animationSpeed * deltaTime;
        if (note.top > height) {
            note.animationState = animationState.finished;
            visibleNotes.splice(visibleNotes.indexOf(note), 1);
        }
        if (settings.mode == Mode.Pause
            && note.top >= _animationContainerHeight - note.height
            && !note.stopped) {
                nextNote = note.name;
                stop();
                note.stopped = true;
                return;
        }

    }

    // Checks which keys should become visible
    for (const note of notes) {
        if (note.startTime <= time && note.animationState === animationState.none) {
            note.top += animationSpeed * (time - note.startTime); // Move note down by potential delay because of discrete timesteps
            note.animationState = animationState.running;
            visibleNotes.push(note);
        }
    }
    const animationFinished = (visibleNotes.length == 0 && notes.length > 0 && notes[notes.length - 1].startTime < time)
    if (!animationFinished) {
        frameId = requestAnimationFrame(animationLoop);
    }
}
