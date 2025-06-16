<script lang="ts">
    import BackButton from "$lib/components/back-button.svelte";
    import MenuButton from "$lib/components/menu-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Einstellungen" />
<MenuButton text="Geschwindigkeit" slug="/settings/difficulty" />
<MenuButton text="Farbschema" slug="/settings/colourscheme" />
<BackButton slug="/" />
