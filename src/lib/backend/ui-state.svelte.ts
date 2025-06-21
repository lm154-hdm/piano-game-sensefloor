export type KeyData = {
    name: string,
    color: string
};

export const keys: KeyData[] = $state(["D4", "E4", "F#4", "G4", "A4", "B4"].map(k => ({
    name: k,
    color: 'white'
})));