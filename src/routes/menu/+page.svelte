<script lang="ts">
    import ExitButton from "$lib/components/exit-button.svelte";
    import NavigationButton from "$lib/components/navigation-button.svelte";
    import PrimaryNavigationButton from "$lib/components/primary-navigation-button.svelte"
    import Title from "$lib/components/title.svelte";
</script>

<main class="stretch-screen flex-bottom flex-row">
    <Title text="Menü" />
    <PrimaryNavigationButton text="Spielen" slug="/prototype" />
    <NavigationButton text="Einstellungen" slug="/menu/settings" />
    <ExitButton />
</main>
