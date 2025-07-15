<script lang="ts" module>
    export enum Direction {
        LEFT,
        RIGHT,
        TOP,
        BOTTOM,
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";
    import type { Vector2 } from "$lib/types";

    interface SensfloorCroppingVerticalHandleProps {
        direction: Direction;
    }

    let { direction }: SensfloorCroppingVerticalHandleProps = $props();

    let position: number = $state(0);
    let lastMousePosition: Vector2 = {
        x: 0,
        y: 0,
    };
    let element: HTMLDivElement;

    onMount(() => {
        const sensFloorConfig = SensFloor.getConfig();
        switch (direction) {
            case Direction.LEFT: position = sensFloorConfig.cropLeft; break;
            case Direction.RIGHT: position = sensFloorConfig.cropRight; break;
            case Direction.TOP: position = sensFloorConfig.cropTop; break;
            case Direction.BOTTOM: position = sensFloorConfig.cropBottom; break;
        }
    });

    function onMouseDown(event: MouseEvent): void {
        if (event.button === 0) {
            lastMousePosition.x = event.clientX;
            lastMousePosition.y = event.clientY;
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
            element.setAttribute("data-focused", "true");
        }
    }

    function onMouseUp(event: MouseEvent): void {
        if (event.button === 0) {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            element.setAttribute("data-focused", "false");
        }
    }

    function onMouseMove(event: MouseEvent): void {
        switch (direction) {
            case Direction.LEFT:
                position += event.clientX - lastMousePosition.x;
                position = Math.max(Math.min(position, window.innerWidth - 10), 0);
                document.documentElement.style.setProperty("--crop-left", position + "px");
                SensFloor.getConfig().cropLeft = position;
                break;
            case Direction.RIGHT:
                position += lastMousePosition.x - event.clientX;
                position = Math.max(Math.min(position, window.innerWidth - 10), 0);
                document.documentElement.style.setProperty("--crop-right", position + "px");
                SensFloor.getConfig().cropRight = position;
                break;
            case Direction.TOP:
                position += event.clientY - lastMousePosition.y;
                position = Math.max(Math.min(position, window.innerHeight - 10), 0);
                document.documentElement.style.setProperty("--crop-top", position + "px");
                SensFloor.getConfig().cropTop = position;
                break;
            case Direction.BOTTOM:
                position += lastMousePosition.y - event.clientY;
                position = Math.max(Math.min(position, window.innerHeight - 10), 0);
                document.documentElement.style.setProperty("--crop-bottom", position + "px");
                SensFloor.getConfig().cropBottom = position;
                break;
        }

        lastMousePosition.x = event.clientX;
        lastMousePosition.y = event.clientY;
    }

    function getHandleClass(): string {
        switch (direction) {
            case Direction.LEFT:
                return `sensfloor-cropping-handle-left`
            case Direction.RIGHT:
                return `sensfloor-cropping-handle-right`
            case Direction.TOP:
                return `sensfloor-cropping-handle-top`
            case Direction.BOTTOM:
                return `sensfloor-cropping-handle-bottom`
        }
    }
</script>

<div
    bind:this={element}
    class="sensfloor-cropping-handle {getHandleClass()}"
    style="--position: {position - 5}px"
    onmousedown={onMouseDown}
    onmouseup={onMouseUp}
>
    <div class="sensfloor-cropping-handle-text-container flex-center">
        <span>{position}</span>
    </div>
</div>

<style>
    .sensfloor-cropping-handle {
        position: absolute;
        background-color: var(--primary);
    }

    .sensfloor-cropping-handle-left {
        top: 0;
        left: var(--position);
        height: 100vh;
        width: 10px;
    }

    .sensfloor-cropping-handle-right {
        top: 0;
        right: var(--position);
        height: 100vh;
        width: 10px;
    }

    .sensfloor-cropping-handle-top {
        left: 0;
        top: var(--position);
        height: 10px;
        width: 100vw;
    }

    .sensfloor-cropping-handle-bottom {
        left: 0;
        bottom: var(--position);
        height: 10px;
        width: 100vw;
    }

    .sensfloor-cropping-handle-left:hover, .sensfloor-cropping-handle-right:hover {
        cursor: col-resize;
    }

    .sensfloor-cropping-handle-top:hover, .sensfloor-cropping-handle-bottom:hover {
        cursor: row-resize;
    }

    :global(.sensfloor-cropping-handle-left[data-focused="true"], .sensfloor-cropping-handle-right[data-focused="true"]) {
        cursor: col-resize;
    }
    
    :global(.sensfloor-cropping-handle-top[data-focused="true"], .sensfloor-cropping-handle-bottom[data-focused="true"]) {
        cursor: row-resize;
    }

    .sensfloor-cropping-handle-text-container {
        position: relative;
        height: 100%;
        padding: 10px;
    }
</style>
