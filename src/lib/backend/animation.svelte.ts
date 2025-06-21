import {Mode, settings} from "./settings.svelte";
import { Midi } from "@tonejs/midi";
import { keys } from "./ui-state.svelte";

type NoteData = {
    height: number;
    top: number;
    left: number;
    startTime: number;
    duration: number;
    name: string;
    stopped: boolean;
    color: string;
};

let _windowHeight: number = 0;
let _animationContainerHeight: number = 0;
let previousTime: number = 0;
let animationSpeed: number = 0;
let frameId: number = 0;
export const notes: NoteData[] = $state([]);
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
            height: height - 5, // treshold to avoid overlapping / sticking out
            top: -height,
            left: keys.indexOf(note.name), // Currently hardcoded, need a proper mapping system later on
            startTime: note.time - trackDelay, // Subtract start time of first note to make it start immediately
            duration: note.duration,
            name: note.name,
            stopped: false,
            color: 'darkblue'
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

export function resume(): void {
    previousTime = performance.now();
    frameId = requestAnimationFrame(animationLoop);
    animationIsRunning = true;
}

export function reset(): void {
    stop();
    time = 0;
    previousTime = 0;
    notes.length = 0;
}

function animationLoop(currentTime: number): void {
    const deltaTime = (currentTime - previousTime) / 1000.0;
    previousTime = currentTime;
    time += deltaTime;

    let shouldStop = false;

    for (const note of notes) {
        if (time >= note.startTime) {
            note.top += animationSpeed * deltaTime;
            if (note.top >= _animationContainerHeight - note.height && !note.stopped) {
                const aKey = keys.find(key2 => key2.color !== "white");
                if (aKey) {
                    aKey.color = 'white';
                }
                nextNote = note;
                shouldStop = true;
                note.stopped = true;
            }
        }
    }

    const lastNote = notes[notes.length - 1];
    const animationFinished = time > (lastNote.startTime + lastNote.duration + (_windowHeight / animationSpeed));
    if (animationFinished) {
        stop();
    } else {
        frameId = requestAnimationFrame(animationLoop);
    }

    if (shouldStop) stop();
}
