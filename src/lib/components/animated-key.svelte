<script lang="ts">
    let { height, top, left }: { height: number; top: number; left: number } = $props();
</script>

<div
    class="animated-key"
    style="
        --height: {height}px;
        --top: {top}px;
        --left: {left};"
></div>

<style>
    .animated-key {
        position: absolute;
        width: var(--button-width);
        height: var(--height);
        left: calc(var(--button-width) * var(--left));
        top: var(--top);
        background-color: darkblue;
    }
</style>
