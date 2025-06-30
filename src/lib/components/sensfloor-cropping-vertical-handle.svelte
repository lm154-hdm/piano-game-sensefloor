<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import { onMount } from "svelte";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";

    interface SensfloorCroppingVerticalHandleProps {
        isLeftHandle: boolean;
    }

    let { isLeftHandle }: SensfloorCroppingVerticalHandleProps = $props();

    let position: number = $state(0);
    let lastMouseX: number = 0;
    let element: HTMLDivElement;

    onMount(() => {
        const sensFloorConfig = SensFloor.getConfig();

        // Temporary for debugging purposes
        sensFloorConfig.cropLeft = import.meta.env.VITE_APPLICATION_CROP_LEFT;
        sensFloorConfig.cropRight = import.meta.env.VITE_APPLICATION_CROP_RIGHT;

        position = isLeftHandle ? sensFloorConfig.cropLeft : sensFloorConfig.cropRight;
    });

    function onMouseDown(event: MouseEvent): void {
        if (event.button === 0) {
            lastMouseX = event.clientX;
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
            //element.classList.remove("sensfloor-cropping-vertical-handle");
            element.setAttribute("data-focused", "true");
        }
    }

    function onMouseUp(event: MouseEvent): void {
        if (event.button === 0) {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            //element.classList.add("sensfloor-cropping-vertical-handle");
        }
    }

    function onMouseMove(event: MouseEvent): void {
        if (isLeftHandle) {
            position += event.clientX - lastMouseX;
        } else {
            position += lastMouseX - event.clientX;
        }
        position = Math.max(Math.min(position, window.innerWidth - 10), 0);
        lastMouseX = event.clientX;

        if (isLeftHandle) {
            document.documentElement.style.setProperty("--crop-left", position + "px");
        } else {
            document.documentElement.style.setProperty("--crop-right", position + "px");
        }
    }
</script>

<div
    bind:this={element}
    class="sensfloor-cropping-vertical-handle"
    style="{isLeftHandle ? '--left:' : '--right:'} {position - 5}px"
    onmousedown={onMouseDown}
>
    <div class="sensfloor-cropping-vertical-handle-text-container flex-center">
        <span>{position}</span>
    </div>
</div>

<style>
    .sensfloor-cropping-vertical-handle {
        position: absolute;
        top: 0;
        left: var(--left);
        right: var(--right);
        width: 10px;
        height: 100vh;
        background-color: var(--primary);
    }

    .sensfloor-cropping-vertical-handle:hover {
        cursor: col-resize;
    }

    :global(.sensfloor-cropping-vertical-handle[data-focused="true"]) {
        cursor: col-resize;
    }

    .sensfloor-cropping-vertical-handle-text-container {
        position: relative;
        height: 100%;
        padding: 10px;
    }
</style>
