<script lang="ts">
    import BackButton from "$lib/components/back-button.svelte";
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Einstellungen" />
<NavigationButton text="Geschwindigkeit" slug="/settings/speed" />
<NavigationButton text="Farbschema" slug="/settings/colourscheme" />
<NavigationButton text="Modus" slug="/settings/mode" />
<BackButton text="Zurück" slug="/" />
