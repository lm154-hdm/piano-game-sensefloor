<script lang="ts">
    const { text, slug }: { text: string; slug: string } = $props();
</script>

<a href={slug}>
    <button>{text}</button>
</a>

<style>
    a {
        width: var(--button-width);
        aspect-ratio: 1 / 1;
    }

    button {
        width: 100%;
        height: 100%;
        text-align: center;
    }
</style>
