<script lang="ts">
    import { values } from "$lib/backend/values.svelte";
    import { onDestroy, onMount } from "svelte";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";

    const { children } = $props();

    onMount(() => {
        SensFloor.registerStepOnListeners();
    });

    onDestroy(() => {
        SensFloor.unregsiterStepOnListeners();
    });
</script>

<main bind:clientWidth={values.playAreaWidth} bind:clientHeight={values.playAreaHeight} class="flex-bottom flex-row">
    {@render children()}
</main>

<style>
    main {
        width: calc(100vw - var(--crop-left) - var(--crop-right));
        height: calc(100vh - var(--crop-top) - var(--crop-bottom));
    }
</style>
