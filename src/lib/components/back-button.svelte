<script lang="ts">
    const { slug }: { slug: string } = $props();
</script>

<a href={slug}>
    <button>Zurück</button>
</a>

<style>
    a {
        position: absolute;
        bottom: 0;
        right: 0;
        width: calc(100vw / 6);
        aspect-ratio: 1 / 1;
    }

    button {
        width: 100%;
        height: 100%;
        text-align: center;
    }
</style>
