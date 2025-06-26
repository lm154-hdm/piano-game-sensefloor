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
    stopped: boolean;
    color: string;
    wasHit: boolean; // if the note was already pressed at the correct time
};

type KeyGroup = {
    color: string;
    displayName: string;
    keyNames: string[];
};

let _windowHeight: number = 0;
let _animationContainerHeight: number = 0;
let previousTime: number = 0;
let animationSpeed: number = 0;
export function getAnimationSpeed(): number {
    return animationSpeed;
}
let frameId: number = 0;
const activeNoteIds: string[] = [];  // stores only note.id
export const notes: NoteData[] = $state([]);
export function getActiveNotes(): NoteData[] {
    return notes?.filter(n => activeNoteIds
        .includes(n.id))
        .sort((a, b) => a.startTime - b.startTime)
        .map(n => ({ ...n })) ?? [];  // return copies, not references
}
export function hitNote(id: string) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    note.color = "--correct-note";
    note.wasHit = true;
}
export const keyGroups: KeyGroup[] = $state([]);
let time: number = 0;
export let animationIsRunning: boolean = false;

export async function initialise(windowHeight: number, animationContainerHeight: number, midi: Midi): Promise<boolean> {
    _windowHeight = windowHeight;
    _animationContainerHeight = animationContainerHeight;

    const beatsPerBar = midi.header.timeSignatures[0]?.timeSignature?.[0] ?? 4;
    const secondsPerBeat = 60 / midi.header.tempos[0].bpm;
    const secondsPerBar = beatsPerBar * secondsPerBeat;
    animationSpeed = animationContainerHeight / secondsPerBar;

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
        keyGroups.push({ color: "--primary", displayName: "", keyNames: [] });
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
            stopped: false,
            color: "--secondary",
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
    for (const note of notes) {
        if (time >= note.startTime) {
            note.top += animationSpeed * deltaTime;
            // TODO: check if called at correct time
            if (note.top >= _animationContainerHeight) {
                const index = activeNoteIds.indexOf(note.id);
                if (index !== -1) {
                    activeNoteIds.splice(index, 1);
                }
                continue;
            }
            if (note.top >= _animationContainerHeight - note.height) {
                if (!activeNoteIds.includes(note.id)) {
                    activeNoteIds.push(note.id)
                }
                if (settings.mode === Mode.Pause && !note.stopped) {
                    const keyGroup = keyGroups.find((key) => key.color !== "--primary");
                    if (keyGroup) {
                        keyGroup.color = "--primary";
                    }
                    shouldStop = true;
                    note.stopped = true;
                }
                //continue;
            }
        }
    }
    const lastNote = notes[notes.length - 1];
    const animationFinished = time > lastNote.startTime + lastNote.duration + _windowHeight / animationSpeed;
    if (animationFinished) {
        stop();
        goto("/prototype/result");
    } else {
        frameId = requestAnimationFrame(animationLoop);
    }
    if (shouldStop) {
        stop();
    }
}
