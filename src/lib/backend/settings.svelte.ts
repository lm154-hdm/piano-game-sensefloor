type Settings = {
    midiFilePath: string;
    speed: number;
    colorSchemeId: string;
    mode: Mode;
    sensFloorConfig: SensFloorConfig;
};

type ColorScheme = {
    id: string;
    displayText: string;
};

type SensFloorConfig = {
    scaleX: number;
    scaleY: number;
    flipX: boolean;
    flipY: boolean;
    rotateBy: number;
    cropLeft: number;
    cropRight: number;
};

export enum Mode {
    Playback = 0,
    Pause = 1
}

export const colorSchemes: ColorScheme[] = [
    {
        id: "default",
        displayText: "Default",
    },
    {
        id: "monochrome",
        displayText: "Monochromatic",
    },
];

export const settings: Settings = $state({
    midiFilePath: "AlleMeineEntchen.mid",
    speed: 100,
    mode: Mode.Playback,
    colorSchemeId: "default",
    sensFloorConfig: {
        scaleX: 1,
        scaleY: 4.0 / 3.0,
        flipX: true,
        flipY: false,
        rotateBy: Math.PI / 2.0,
        cropLeft: 0,
        cropRight: 0,
    },
});
