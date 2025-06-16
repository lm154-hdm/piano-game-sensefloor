<script lang="ts">
    import BackButton from "$lib/components/back-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<main>
    <Title text="Adminpanel - Songauswahl" />

    Incoming...

    <BackButton slug="/admin" />
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
