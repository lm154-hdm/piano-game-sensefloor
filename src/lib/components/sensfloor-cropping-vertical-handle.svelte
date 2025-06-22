<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import { onMount } from "svelte";

    interface SensfloorCroppingVerticalHandleProps {
        isLeftHandle: boolean;
    }

    let { isLeftHandle }: SensfloorCroppingVerticalHandleProps = $props();

    let position: number = 0;
    let lastMouseX: number = 0;
    let element: HTMLDivElement;

    onMount(() => {
        position = isLeftHandle ? settings.sensFloorConfig.cropLeft : settings.sensFloorConfig.cropRight;
    });

    function onMouseDown(event: MouseEvent): void {
        if (event.button === 0) {
            lastMouseX = event.clientX;
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
            element.classList.remove("sensfloor-cropping-vertical-handle");
            element.setAttribute("data-focused", "true");
        }
    }

    function onMouseUp(event: MouseEvent): void {
        if (event.button === 0) {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            element.classList.add("sensfloor-cropping-vertical-handle");
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
            settings.sensFloorConfig.cropLeft = position;
            document.documentElement.style.setProperty("--crop-left", position + "px");
        } else {
            settings.sensFloorConfig.cropRight = position;
            document.documentElement.style.setProperty("--crop-right", position + "px");
        }
    }
</script>

<div
    bind:this={element}
    class="sensfloor-cropping-vertical-handle"
    style="{isLeftHandle ? '--left:' : '--right:'} -5px"
    onmousedown={onMouseDown}
></div>

<style>
    div {
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

    :global(div[data-focused="true"]) {
        cursor: col-resize;
    }
</style>
