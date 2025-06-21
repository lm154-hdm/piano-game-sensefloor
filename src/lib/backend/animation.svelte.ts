import {Mode, settings} from "./settings.svelte";
import { Midi } from "@tonejs/midi";
import { keys } from "./ui-state.svelte";

type NoteData = {
    height: number;
    top: number;
    left: number;
    startTime: number;
    duration: number;
    animationState: number;
    name: string;
    stopped: boolean;
    color: string;
};

// We need to do the animation state with an object like this because enums are discouraged in .svelte files
const animationState = {
    none: 0,
    running: 1,
    invisibleBehindKeys: 2,
    finished: 3,
};

let _windowHeight: number = 0;
let _animationContainerHeight: number = 0;
let previousTime: number = 0;
let animationSpeed: number = 0;
let frameId: number = 0;
const notes: NoteData[] = [];
export const visibleNotes: NoteData[] = $state([]);
export let activeNote: NoteData;
let time: number = 0;
export function getTime(): number {
    return time;
}
let nextNote = $state<NoteData | undefined>(undefined);
export function getNextNote() {
    return nextNote;
}
export let animationIsRunning: boolean = false;

let atx = 0;

export async function initialise(
    keys: string[],
    windowHeight: number,
    animationContainerHeight: number,
    midi: Midi
): Promise<boolean> {
    _windowHeight = windowHeight;
    _animationContainerHeight = animationContainerHeight;

    const beatsPerBar = midi.header.timeSignatures[0].timeSignature[0];
    const secondsPerBeat = 60 / midi.header.tempos[0].bpm;
    const secondsPerBar = beatsPerBar * secondsPerBeat;
    animationSpeed = animationContainerHeight / secondsPerBar;

    const track = midi.tracks[1];
    const trackDelay = track.notes[0].time;
    for (const note of track.notes) {
        const height = note.duration * animationSpeed;
        notes.push({
            height: height,
            top: -height,
            left: keys.indexOf(note.name), // Currently hardcoded, need a proper mapping system later on
            startTime: note.time - trackDelay, // Subtract start time of first note to make it start immediately
            // Subtract start time of first note to make it start immediately
            duration: note.duration,
            animationState: animationState.none,
            name: note.name,
            stopped: false,
            color: 'darkblue'
        });
        if (note.time === 2.9557291666666665) {
            atx = note.time - trackDelay;
        }
    }
    console.log(midi.tracks[1].notes)
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
    stop();
    time = 0;
    // previousTime = 0;
    notes.length = 0;
    visibleNotes.length = 0;
}

function

animationLoop(currentTime: number): void {
    // Calculate time values
    const deltaTime = (currentTime - previousTime) / 1000.0;  // // 0.01669999999999999
    previousTime = currentTime;
    time += deltaTime;

    const n = visibleNotes.find(n => n.startTime == atx);
    if (n) {
        console.log(n.top)
    }

    // Animate visible keys
    for (const note of visibleNotes) {
        note.top += animationSpeed * deltaTime;
        if (note.top >= _windowHeight) {
            note.animationState = animationState.finished;
            visibleNotes.splice(visibleNotes.indexOf(note), 1);
        }
        // AFTER
        // Problem #1: Not called weil
        if (note.top >= _animationContainerHeight
            && note.animationState == animationState.running) {
            const aKey = keys.find(key2 =>
                key2.name === note.name
                && key2.color !== "white"
            );
            if (aKey) {
                aKey.color = 'white';
                note.animationState = animationState.invisibleBehindKeys;
                console.log("white TIME", getTime())
            }
        }
        if (settings.mode == Mode.Pause
            && note.top >= _animationContainerHeight - note.height
            && !note.stopped) {
                nextNote = note;
                stop();
                note.stopped = true;
                return;
        }

        // problematisch, activenote schon zu früh geändert...
        const activeStartTime = note.startTime + (_animationContainerHeight / animationSpeed)
        if (time >= activeStartTime && time <= activeStartTime + note.duration) {
            activeNote = note;
        }
        // option A: do it outside of animation loop
        // option B: do it via "top" --> kinda stupid...

    }

    // Checks which keys should become visible
    for (const note of notes) {
        if (note.startTime <= time && note.animationState === animationState.none) {
            note.top += animationSpeed * (time - note.startTime); // Move note down by potential delay because of discrete timesteps
            note.animationState = animationState.running;
            visibleNotes.push(note);
        }
    }
    const animationFinished =
        visibleNotes.length == 0
        && notes.length > 0
        && notes[notes.length - 1].startTime < time;
    if (!animationFinished) {
        frameId = requestAnimationFrame(animationLoop);
    }
}
