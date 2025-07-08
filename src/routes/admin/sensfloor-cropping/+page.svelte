<script lang="ts">
    import BackButton from "$lib/components/back-button.svelte";
    import SensfloorCroppingVerticalHandle from "$lib/components/sensfloor-cropping-vertical-handle.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<aside class="admin">
    <h1>Adminpanel</h1>
    <a class="admin" href="/admin/songselection">
        <button class="admin menu-button secondary-button">Songauswahl</button>
    </a>
    <a class="admin" href="/admin/sensfloor-cropping">
        <button class="admin menu-button secondary-button">SensFloor zuschneiden</button>
    </a>
    <a class="admin" href="/menu">
        <button class="admin menu-button primary-button">Hauptmenü</button>
    </a>
</aside>

<main class="stretch-screen flex-bottom flex-row">
    <Title text="Adminpanel - SensFloor zuschneiden" />
    <SensfloorCroppingVerticalHandle isLeftHandle={true} />
    <SensfloorCroppingVerticalHandle isLeftHandle={false} />
    <!-- <BackButton text="Zurück" slug="/admin" shouldSave={true} /> -->
</main>
