type Score = {
    totalPressed: number;
    correctlyPressed: number;
};

export const score: Score = $state({
    totalPressed: 0,
    correctlyPressed: 0,
});
