<script lang="ts">
    import MenuButton from "$lib/components/menu-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Menü" />
<MenuButton text="Spielen" slug="/prototype" width={6} />
<MenuButton text="Einstellungen" slug="/settings" width={6} />
