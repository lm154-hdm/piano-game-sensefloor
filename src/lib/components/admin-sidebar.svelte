<aside>
    <div class="aside-container">
        <h1>Adminpanel</h1>
        <div class="button-container">
            <div>
                <a class="secondary-button" href="/admin/songselection">Songauswahl</a>
                {#if import.meta.env.DEV}
                    <a class="secondary-button" href="/admin/sensfloor-cropping">Sensfloor<br />zuschneiden</a>
                {/if}
            </div>

            <a class="primary-button" href="/sensfloor/menu">Hauptmenü</a>
        </div>
    </div>
</aside>

<style>
    aside {
        position: absolute;
        top: 0;
        left: 0;
        width: 20%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: var(--background-lighter);
    }

    h1 {
        text-align: center;
    }

    a {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        text-decoration: none;
        margin: 0 10px 10px 0;
    }

    .aside-container {
        height: 100%;
        padding: 1em;
        display: flex;
        flex-direction: column;
    }

    .button-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
    }
</style>
