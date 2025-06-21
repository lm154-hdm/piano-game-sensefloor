<script lang="ts">
    let { height, top, left, color }: { height: number; top: number; left: number; color: string } = $props();
</script>

<div
    class="animated-key"
    style="
        --height: {height}px;
        --top: {top}px;
        --left: {left};
        --color: {color}"
></div>

<style>
    .animated-key {
        position: absolute;
        width: var(--button-width);
        height: var(--height); /**/
        left: calc(var(--button-width) * var(--left));
        /*top: var(--top);*/
        transform: translateY(var(--top)); /**/
        background-color: var(--color);
    }
</style>
