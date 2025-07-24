<script lang="ts">
    import AdminSidebar from "$lib/components/admin/admin-sidebar.svelte";
    import BrowserLink from "$lib/components/admin/browser-link.svelte";
    import SensfloorCroppingHandle, { Direction } from "$lib/components/admin/sensfloor-cropping-handle.svelte";
</script>

<AdminSidebar />

<main class="stretch-screen flex-column admin-main">
    <h1>Hilfeseite - SensFloor zuschneiden</h1>

    <div>
        <p>
            Die Anleitung zur Nutzung dieses Tools kann in der
            <BrowserLink
                url="https://gitlab.mi.hdm-stuttgart.de/klavier/klavierspiel-mit-sensorteppich/-/wikis/Abgabe/Installationsanleitung#35-applikation-zuschneiden"
                text="Installationsanleitung"
            />
            nachgelesen werden.
        </p>
    </div>
</main>

<SensfloorCroppingHandle direction={Direction.LEFT} />
<SensfloorCroppingHandle direction={Direction.RIGHT} />
<SensfloorCroppingHandle direction={Direction.TOP} />
<SensfloorCroppingHandle direction={Direction.BOTTOM} />

<style>
    div {
        width: 50%;
        pointer-events: none;
    }
</style>
