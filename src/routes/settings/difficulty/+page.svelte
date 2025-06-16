<script lang="ts">
    import { settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import MenuButton from "$lib/components/menu-button.svelte";
    import Title from "$lib/components/title.svelte";
</script>

<Title text="Einstellungen - Geschwindigkeit" />

<div class="difficulty-container">
    <h2>Aktuelle Geschwindigkeit: {settings.bpm}%</h2>
    <div class="difficulty-button-container">
        <button
            onclick={() => {
                settings.bpm += 10;
            }}
        >
            Schneller
        </button>

        <button
            onclick={() => {
                settings.bpm -= 10;
            }}
        >
            Langsamer
        </button>
    </div>
</div>

<BackButton slug="/settings" />

<style>
    .difficulty-container {
        width: calc(100vw / 3);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .difficulty-button-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    button {
        width: calc(100vw / 6);
        aspect-ratio: 1 / 1;
        text-align: center;
    }
</style>
