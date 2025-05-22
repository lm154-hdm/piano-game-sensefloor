type Settings = {
    bpm: number;
    colorSchemeId: string;
};

type ColorScheme = {
    id: string;
    displayText: string;
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
    bpm: 120,
    colorSchemeId: "default",
});
