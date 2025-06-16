<script lang="ts">
    const { text, slug, width }: { text: string; slug: string; width: number } = $props();
</script>

<a href={slug} style="--width: {width}">
    <button>{text}</button>
</a>

<style>
    a {
        width: calc(100vw / var(--width));
        aspect-ratio: 1 / 1;
    }

    button {
        width: 100%;
        height: 100%;
        text-align: center;
    }
</style>
