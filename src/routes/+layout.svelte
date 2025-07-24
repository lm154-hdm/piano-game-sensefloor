<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import "../app.css";

    let { children } = $props();
    let wakeLock: WakeLockSentinel;

    onMount(async () => {
        wakeLock = await navigator.wakeLock.request("screen");
    });

    onDestroy(async () => {
        if (wakeLock) {
            await wakeLock.release();
        }
    });
</script>

{@render children()}
