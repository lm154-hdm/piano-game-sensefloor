<script lang="ts">
    import BackButton from "$lib/components/back-button.svelte";
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>
<aside class="admin">
    <h1 class="admin">Adminpanel</h1>
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
    <!--
    <Title text="Adminpanel" />
    <NavigationButton text="Songauswahl" slug="/admin/songselection" />
    <NavigationButton text="SensFloor ausrichten" slug="/admin/sensfloor-alignment" />
    <NavigationButton text="SensFloor zuschneiden" slug="/admin/sensfloor-cropping" />
    <BackButton text="Hauptmenü" slug="/menu" />
    -->
</main>
