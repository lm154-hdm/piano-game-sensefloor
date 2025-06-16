<script lang="ts">
    import { applyMappingToCoordinates } from "$lib/backend/sens-floor/sens-floor";

    let {
        title,
        initialCoordinates,
        transformCoordinates = false,
    }: { title: string; initialCoordinates: { x: number; y: number }[]; transformCoordinates: boolean } = $props();

    let coordinates: { x: number; y: number }[] = $state([]);

    $effect(() => {
        for (let i = 0; i < initialCoordinates.length; i++) {
            if (transformCoordinates) {
                const c = applyMappingToCoordinates(initialCoordinates[i].x, initialCoordinates[i].y);
                c.x = Math.round(c.x);
                c.y = Math.round(c.y);
                coordinates[i] = c;
            } else {
                coordinates[i] = { x: initialCoordinates[i].x, y: initialCoordinates[i].y };
            }
        }
    });
</script>

<div class="sensfloor-display-container">
    <div class="sensfloor-display">
        {#if coordinates.length == 4}
            <span class="sensfloor-display-coordinates-top-left">{coordinates[0].x}|{coordinates[0].y}</span>
            <span class="sensfloor-display-coordinates-top-right">{coordinates[1].x}|{coordinates[1].y}</span>
            <span class="sensfloor-display-coordinates-bottom-right">{coordinates[2].x}|{coordinates[2].y}</span>
            <span class="sensfloor-display-coordinates-bottom-left">{coordinates[3].x}|{coordinates[3].y}</span>
        {/if}
    </div>
    <h2>{title}</h2>
</div>

<style>
    .sensfloor-display-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .sensfloor-display {
        position: relative;
        width: 480px;
        height: 270px;
        background-color: transparent;
        outline: solid;
    }

    .sensfloor-display-coordinates-top-left {
        position: absolute;
        top: -30px;
        left: 0;
    }

    .sensfloor-display-coordinates-top-right {
        position: absolute;
        top: -30px;
        right: 0;
        text-align: right;
    }

    .sensfloor-display-coordinates-bottom-right {
        position: absolute;
        bottom: -30px;
        right: 0;
        text-align: right;
    }

    .sensfloor-display-coordinates-bottom-left {
        position: absolute;
        bottom: -30px;
        left: 0;
    }
</style>
