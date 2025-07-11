<script lang="ts">
    import { score } from "$lib/backend/score.svelte";
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
    import { onDestroy } from "svelte";

    const finalScore =
        score.totalNotes > 0
            ? Math.round((score.correctlyPressed / (score.totalNotes + score.incorrectlyPressed)) * 100)
            : 0;
    onDestroy(() => {
        score.totalNotes = 0;
        score.incorrectlyPressed = 0;
        score.correctlyPressed = 0;
    });
</script>

<Title text="Game Over" />
<div class="score-container">
    <p>Korrekt gedrückte Tasten: {score.correctlyPressed} / {score.totalNotes}</p>
    <p>Fehltritte: {score.incorrectlyPressed}</p>
    <p>
        Score: <span class="score">{finalScore}%</span> ({score.correctlyPressed} / {score.totalNotes +
            score.incorrectlyPressed})
    </p>
</div>
<NavigationButton text="Neustart" slug="/prototype" />
<NavigationButton text="Hauptmenü" slug="/menu" />

<style>
    .score-container {
        color: var(--text);
        position: absolute;
        padding: 0;
        margin: 0;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: bolder;
        font-size: 36px;
        text-align: center;
    }
    .score {
        font-size: 44px;
        font-weight: bold;
    }
</style>
