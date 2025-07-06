<script lang="ts">
    import BackButton from "$lib/components/back-button.svelte";
    import SensfloorCroppingVerticalHandle from "$lib/components/sensfloor-cropping-vertical-handle.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<main class="stretch-screen flex-bottom flex-row">
    <Title text="Adminpanel - SensFloor zuschneiden" />
    <SensfloorCroppingVerticalHandle isLeftHandle={true} />
    <SensfloorCroppingVerticalHandle isLeftHandle={false} />
    <BackButton text="Zurück" slug="/admin" shouldSave={true} />
</main>
