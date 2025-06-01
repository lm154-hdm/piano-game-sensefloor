<script lang="ts">
    const { width, height, top, left } = $props();
</script>

<div
    class="animated-key"
    style="
        --width: {width}px;
        --height: {height}px;
        --top: {top}px;
        --left: {left}px;"
></div>

<style>
    .animated-key {
        position: absolute;
        width: var(--width);
        height: var(--height);
        left: var(--left);
        top: var(--top);
        background-color: #0000ff;
    }
</style>
