<script lang="ts">
    interface AnimatedKeyProps {
        height: number;
        top: number;
        left: number;
        color: string;
    }

    let { height, top, left, color }: AnimatedKeyProps = $props();
</script>

<div
    class="animated-key"
    style="
        --height: {height}px;
        --top: {top}px;
        --left: {left};
        --color: var({color})"
></div>

<style>
    .animated-key {
        position: absolute;
        width: var(--button-width);
        height: var(--height);
        left: calc(var(--button-width) * var(--left));
        transform: translateY(var(--top));
        background-color: var(--color);
        border-radius: var(--button-border-radius);
        border: 2px solid var(--background-color);
    }
</style>
