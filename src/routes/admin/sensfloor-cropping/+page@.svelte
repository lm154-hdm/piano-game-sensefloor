<script lang="ts">
    import AdminSidebar from "$lib/components/admin-sidebar.svelte";
    import SensfloorCroppingHandle, { Direction } from "$lib/components/sensfloor-cropping-handle.svelte";
</script>

<AdminSidebar />

<main class="stretch-screen flex-column admin-main">
    <h1>Hilfeseite - SensFloor zuschneiden</h1>

    <div>
        <p>
            Sollte der Beamer über den SensFloor hinaus strahlen, muss die Applikation zugeschnitten werden.
            Dafür sind die vier <strong>.env</strong>-Variablen "VITE_APPLICATION_CROP_LEFT", etc. verantwortlich.
        </p>
        <p>
            Bewege die angezeigten Balken mit der Maus und richte sie auf die Kanten des SensFloors aus.<br />
            Übertrage anschließend die Werte, welche neben den Balken stehen, in die entsprechenden Variablen in der <strong>.env</strong>-Datei und starte das Spiel neu.
        </p>
        <p>
            Dieses Feature, so wie andere Dev-Features, sind leider nicht Barrierefrei gestaltet.
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
