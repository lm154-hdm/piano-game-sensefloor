<<<<<<< HEAD
<script lang="ts">
    import { PadPart } from "$lib/backend/sens-floor/pad-part";
    import {
        initialise,
        connect,
        disconnect,
        addStepOnListener,
        addStepOffListener,
    } from "$lib/backend/sens-floor/sens-floor";
    import { onMount, onDestroy } from "svelte";

    onMount(() => {
        initialise(8, 6);
        addStepOnListener((x: number, y: number, part: PadPart) => {
            console.log(`Stepped on pad (${x}|${y}), part ${PadPart[part]}`);
        });
        addStepOffListener((x: number, y: number, part: PadPart) => {
            console.log(`Stepped off pad (${x}|${y}), part ${PadPart[part]}`);
        });
        connect("192.168.178.22", 8000);
    });

    onDestroy(() => {
        disconnect();
    });
</script>
=======
>>>>>>> origin/develop
