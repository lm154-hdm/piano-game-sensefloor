type Score = {
    totalNotes: number;
    correctlyPressed: number;
    incorrectlyPressed: number;
};

export const score: Score = $state({
    totalNotes: 0,
    correctlyPressed: 0,
    incorrectlyPressed: 0,
});
