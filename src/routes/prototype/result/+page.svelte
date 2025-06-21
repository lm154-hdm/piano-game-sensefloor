<script lang="ts">
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
    import { score} from "$lib/backend/ui-state.svelte";
    import {onDestroy} from "svelte";

    onDestroy(() => {
        score.totalCount = 0;
        score.correctlyPressed = 0;
    });
</script>

<Title text="Game Over" />
<div class="score-container">
    Score: {
    score.totalCount > 0
        ? Math.round((score.correctlyPressed / score.totalCount) * 100)
        : 0
    }%
    <p>Korrekt gedrückte Tasten: {score.correctlyPressed} / {score.totalCount}</p>
</div>
<NavigationButton text="Neustart" slug="/prototype" />
<NavigationButton text="Hauptmenü" slug="/" />

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

</style>