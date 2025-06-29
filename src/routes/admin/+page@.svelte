<script lang="ts">
    import BackButton from "$lib/components/back-button.svelte";
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Adminpanel" />
<NavigationButton text="Songauswahl" slug="/admin/songselection" />
<NavigationButton text="SensFloor ausrichten" slug="/admin/sensfloor-alignment" />
<NavigationButton text="SensFloor zuschneiden" slug="/admin/sensfloor-cropping" />
<NavigationButton text="SensFloor konfigurieren" slug="/admin/sensfloor-config" />
<BackButton text="Hauptmenü" slug="/menu" />
