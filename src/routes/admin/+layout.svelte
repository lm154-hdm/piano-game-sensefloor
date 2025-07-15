<script lang="ts">
    let { children } = $props();
</script>

<main class="stretch-screen flex-center flex-row">
    {@render children()}

    <div class="button-container bottom-right-corner">
        <a class="secondary-button" href="/admin/songselection">Songauswahl</a>
        {#if import.meta.env.DEV}
            <a class="secondary-button" href="/admin/sensfloor-cropping">Sensfloor<br />zuschneiden</a>
        {/if}
        <a class="primary-button" href="/sensfloor/menu">Hauptmenü</a>
    </div>
</main>


<style>
    a {
        text-align: center;
        text-decoration: none;
        margin: 0 10px 10px 0;
    }

    .button-container {
        display: flex;
        flex-direction: column;
    }
</style>