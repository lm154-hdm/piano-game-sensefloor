<script lang="ts">
    import BackButton from "$lib/components/back-button.svelte";
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Adminpanel" />
<NavigationButton text="Songauswahl" slug="/admin/songselection" />
<NavigationButton text="SensFloor-Ausrichtung" slug="/admin/sensfloor-alignment" />
<BackButton text="Hauptmenü" slug="/" />
