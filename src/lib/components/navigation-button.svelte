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
        font-size: 1.2em;
        background-color: var(--primary);
        color: var(--text-dark);
        border-radius:5%;
        border: 2px solid var(--background-color);
    }
</style>
