<script lang="ts">
    import ExitButton from "$lib/components/exit-button.svelte";
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Menü" />
<NavigationButton text="Spielen" slug="/sensfloor/prototype" />
<NavigationButton text="Einstellungen" slug="/sensfloor/menu/settings" />
<ExitButton />
