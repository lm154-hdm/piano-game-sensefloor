type Settings = {
    midiFilePath: string;
    speed: number;
    colorSchemeId: string;
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
};

export const colorSchemes: ColorScheme[] = [
    {
        id: "default",
        displayText: "Default",
    },
    {
        id: "redgreen",
        displayText: "Red-green",
    },
    {
        id: "monochromatic",
        displayText: "Monochromatic",
    },
];

export const settings: Settings = $state({
    midiFilePath: "AlleMeineEntchen.mid",
    speed: 100,
    colorSchemeId: "default",
    sensFloorConfig: {
        scaleX: 1,
        scaleY: 4.0 / 3.0,
        flipX: true,
        flipY: false,
        rotateBy: Math.PI / 2.0,
    },
});
