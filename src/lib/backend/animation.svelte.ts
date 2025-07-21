import { Midi } from "@tonejs/midi";
import { Mode, settings } from "$lib/backend/settings.svelte";
import { goto } from "$app/navigation";

export type NoteData = {
    id: string,
    height: number;
    top: number;
    left: number;
    startTime: number;
    duration: number;
    name: string;
    groupIndex: number;
    color: string;
    wasHit: boolean; // if the note was already pressed at the correct time
};

type KeyGroup = {
    color: string;
    displayName: string;
    keyNames: string[];
};

let windowHeight: number = 0;
let animationContainerHeight: number = 0;
let previousTime: number = 0;
let animationSpeed: number = 0;
let bufferHeight: number = 0;
export function getAnimationSpeed(): number {
    return animationSpeed;
}
let frameId: number = 0;
const activeNoteIds: Map<string, NoteData> = new Map();  // stores only note.id
export const notes: NoteData[] = $state([]);
export function getActiveNotes(): NoteData[] {
    return notes?.filter(n => activeNoteIds
        .has(n.id))
        .sort((a, b) => a.startTime - b.startTime)
        .map(n => ({ ...n })) ?? [];  // return copies, not references
}
export function hitNote(id: string) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    note.color = "--correct-note";
    note.wasHit = true;
    if (settings.mode === Mode.Pause) {
        activeNoteIds.delete(note.id);
    }
}
export const keyGroups: KeyGroup[] = $state([]);
let time: number = 0;
export let animationIsRunning: boolean = false;

export async function initialise(windowHeightParam: number, animationContainerHeightParam: number, midi: Midi): Promise<boolean> {
    windowHeight = windowHeightParam;
    animationContainerHeight = animationContainerHeightParam;

    const beatsPerBar = midi.header.timeSignatures[0]?.timeSignature?.[0] ?? 4;
    const secondsPerBeat = 60 / midi.header.tempos[0].bpm;
    const secondsPerBar = beatsPerBar * secondsPerBeat;
    animationSpeed = animationContainerHeightParam / secondsPerBar;
    bufferHeight = animationSpeed * settings.buffer;
    const track = midi.tracks[settings.midiConfig.trackIndex];

    // Find all used keys in the selected track and sort them in the piano scale
    const keyNames: { name: string; midiValue: number }[] = [];
    for (const note of track.notes) {
        if (!keyNames.some((n) => n.midiValue === note.midi)) {
            keyNames.push({ name: note.name, midiValue: note.midi });
        }
    }
    keyNames.sort((a, b) => a.midiValue - b.midiValue);

    // Create empty key groups
    keyGroups.length = 0;
    for (let i = 0; i < 6; i++) {
        keyGroups.push({ color: "--secondary", displayName: "", keyNames: [] });
    }

    // Group the keys into 6 groups after the round-robin principle
    let keysPerGroup = keyNames.length / 6;
    for (let i = 0; i < keyNames.length; i++) {
        const key = keyNames[i];
        const index = Math.floor(i / keysPerGroup);
        keyGroups[index].keyNames.push(key.name);
    }

    // Create the display names for the groups
    for (const keyGroup of keyGroups) {
        for (let i = 0; i < keyGroup.keyNames.length; i++) {
            keyGroup.displayName += keyGroup.keyNames[i];
            if (i !== keyGroup.keyNames.length - 1) {
                keyGroup.displayName += " / ";
            }
        }
    }

    // Create data for rendering the animated keys
    const trackDelay = track.notes[0].time;
    for (let i = 0; i < track.notes.length; i++) {
        const note = track.notes[i];
        const height = note.duration * animationSpeed;
        const groupIndex = keyGroups.findIndex((group) => group.keyNames.includes(note.name));
        notes.push({
            id: crypto.randomUUID(),
            height: height - 5, // treshold to avoid overlapping / sticking out
            top: -height,
            left: groupIndex,
            startTime: note.time - trackDelay, // Subtract start time of first note to make it start immediately
            duration: note.duration,
            name: note.name,
            groupIndex: groupIndex,
            color: "--light-color",
            wasHit: false,
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

    for (let i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];

        if (time >= note.startTime) {
            note.top += animationSpeed * deltaTime;
            if (note.top >= animationContainerHeight) {
                activeNoteIds.delete(note.id);
                notes.splice(i, 1);
                continue;
            }
            else if (note.top >= animationContainerHeight - note.height - bufferHeight && !note.wasHit) {
                if (!activeNoteIds.has(note.id)) {
                    activeNoteIds.set(note.id, note)
                }
            }
            if (settings.mode === Mode.Pause) {
                if (note.top >= animationContainerHeight - note.height && !note.wasHit) {
                    shouldStop = true;
                }
            }
        }
    }
    const animationFinished = notes.length <= 0;
    if (animationFinished) {
        setTimeout(() => {
            stop();
            goto("/sensfloor/prototype/result");
        }, 1000);
    } else {
        frameId = requestAnimationFrame(animationLoop);
    }
    if (shouldStop) {
        stop();
    }
}
