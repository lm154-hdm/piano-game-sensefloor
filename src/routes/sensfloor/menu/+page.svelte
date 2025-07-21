<script lang="ts">
    import ExitButton from "$lib/components/buttons/exit-button.svelte";
    import NavigationButton from "$lib/components/buttons/navigation-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Menü" />
<NavigationButton classNames="primary-button" text="Spielen" slug="/sensfloor/prototype"/>
<NavigationButton text="Einstellungen" slug="/sensfloor/menu/settings" />
<ExitButton />
