<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import flipHorizontalIcon from "$lib/assets/flip-horizontal.svg";
    import flipVerticalIcon from "$lib/assets/flip-vertical.svg";
    import rotateLeftIcon from "$lib/assets/rotate-left.svg";
    import rotateRightIcon from "$lib/assets/rotate-right.svg";
    import SensfloorAlignmentButton from "$lib/components/admin/sensfloor-alignment-button.svelte";
    import * as SensFloor from "$lib/backend/sens-floor/sens-floor";
    import BrowserLink from "$lib/components/browser-link.svelte";

    let coordinate: string = $state("");
    let config = $state(SensFloor.getConfig());

    onMount(async () => {
        await SensFloor.connect(0, 0, 0, 0);
        SensFloor.registerStepOnListener(stepOnListener);
    });

    onDestroy(() => {
        SensFloor.unregisterStepOnListener(stepOnListener);
        SensFloor.disconnect();
    })

    function stepOnListener(event: SensFloor.StepEventData): void {
        coordinate = `(${event.normalisedX}|${event.normalisedY})`;
    }

    function flipHorizontal(): void {
        config.flipX = !config.flipX;
        config = config;
    }

    function flipVertical(): void {
        config.flipY = !config.flipY;
        config = config;
    }

    function rotateLeft(): void {
        if (config.flipX === config.flipY) {
            config.rotateBy -= Math.PI / 2;
        } else {
            config.rotateBy += Math.PI / 2;
        }
        config = config;
    }

    function rotateRight(): void {
        if (config.flipX === config.flipY) {
            config.rotateBy += Math.PI / 2;
        } else {
            config.rotateBy -= Math.PI / 2;
        }
        config = config;
    }

</script>

<h1>SensFloor ausrichten</h1>

<div>
    <p>
        Die Anleitung zur Nutzung dieses Tools kann in der
        <BrowserLink
            url="https://gitlab.mi.hdm-stuttgart.de/klavier/klavierspiel-mit-sensorteppich/-/wikis/Abgabe/Installationsanleitung#34-sensfloor-ausrichten"
            text="Installationsanleitung"
        />
        nachgelesen werden.
    </p>
</div>

<div>
    <h2>Koordinaten des zuletzt gedrückten SensFloor-Pads:</h2>
    <h3>{coordinate}</h3>

    <div class="sensfloor-alignment-button-container">
        <div class="sensfloor-alignment-rotation-container">
            <div class="sensfloor-alignment-rotation-button-container">
                <SensfloorAlignmentButton
                    text="-90°"
                    icon={rotateLeftIcon}
                    alt="Ein halbkreisförmiger, nach links gedrehter Pfeil"
                    onClick={rotateLeft}
                />
                <SensfloorAlignmentButton
                    text="+90°"
                    icon={rotateRightIcon}
                    alt="Ein halbkreisförmiger, nach rechts gedrehter Pfeil"
                    onClick={rotateRight}
                />
            </div>
            Aktuelle Rotation: {config.rotateBy}
            VITE_SENSFLOOR_ROTATE_BY
        </div>
        <SensfloorAlignmentButton
            text="Horizontal spiegeln:<br/>{config.flipX ? 'Ja' : 'Nein'}<br/>VITE_SENSFLOOR_FLIP_Y"
            icon={flipHorizontalIcon}
            alt="Ein Pfeil, der nach links und rechts zeigt"
            onClick={flipHorizontal}
        />
        <SensfloorAlignmentButton
            text="Vertikal spiegeln:<br/>{config.flipY ? 'Ja' : 'Nein'}<br/>VITE_SENSFLOOR_FLIP_Y"
            icon={flipVerticalIcon}
            alt="Ein Pfeil, der nach oben und unten zeigt"
            onClick={flipVertical}
        />
    </div>
</div>

<style>
    div {
        width: 50%;
    }

    .sensfloor-alignment-button-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 20px;
    }

    .sensfloor-alignment-rotation-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .sensfloor-alignment-rotation-button-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 20px;
    }
</style>
