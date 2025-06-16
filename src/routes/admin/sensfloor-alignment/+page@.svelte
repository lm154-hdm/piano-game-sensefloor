<script lang="ts">
    import flipHorizontalIcon from "$lib/assets/flip-horizontal.svg";
    import flipVerticalIcon from "$lib/assets/flip-vertical.svg";
    import rotateLeftIcon from "$lib/assets/rotate-left.svg";
    import rotateRightIcon from "$lib/assets/rotate-right.svg";
    import { settings } from "$lib/backend/settings.svelte";
    import BackButton from "$lib/components/back-button.svelte";
    import SensfloorAlignmentButton from "$lib/components/sensfloor-alignment-button.svelte";
    import SensfloorDisplay from "$lib/components/sensfloor-display.svelte";
    import Title from "$lib/components/title.svelte";

    function flipHorizontal(): void {
        settings.sensFloorConfig.flipX = !settings.sensFloorConfig.flipX;
    }

    function flipVertical(): void {
        settings.sensFloorConfig.flipY = !settings.sensFloorConfig.flipY;
    }

    function rotateLeft(): void {
        if (settings.sensFloorConfig.flipX === settings.sensFloorConfig.flipY) {
            settings.sensFloorConfig.rotateBy -= Math.PI / 2;
        } else {
            settings.sensFloorConfig.rotateBy += Math.PI / 2;
        }
    }

    function rotateRight(): void {
        if (settings.sensFloorConfig.flipX === settings.sensFloorConfig.flipY) {
            settings.sensFloorConfig.rotateBy += Math.PI / 2;
        } else {
            settings.sensFloorConfig.rotateBy -= Math.PI / 2;
        }
    }
</script>

<main>
    <Title text="Adminpanel - SensFloor-Ausrichtung" />

    <div class="sensfloor-alignment-container">
        <div class="sensfloor-alignment-visuals-container">
            <SensfloorDisplay
                title="Aktuell"
                transformCoordinates={true}
                initialCoordinates={[
                    {
                        x: 1,
                        y: 1,
                    },
                    {
                        x: 1,
                        y: 0,
                    },
                    {
                        x: 0,
                        y: 0,
                    },
                    {
                        x: 0,
                        y: 1,
                    },
                ]}
            />
            <SensfloorDisplay
                title="Ziel"
                initialCoordinates={[
                    {
                        x: 0,
                        y: 0,
                    },
                    {
                        x: 1,
                        y: 0,
                    },
                    {
                        x: 1,
                        y: 1,
                    },
                    {
                        x: 0,
                        y: 1,
                    },
                ]}
            />
        </div>
        <div class="sensfloor-alignment-button-container">
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
            <SensfloorAlignmentButton
                text="Vertikal spiegeln<br>{settings.sensFloorConfig.flipY ? 'Ja' : 'Nein'}"
                icon={flipVerticalIcon}
                alt="Ein Pfeil, der nach oben und unten zeigt"
                onClick={flipVertical}
            />
            <SensfloorAlignmentButton
                text="Horizontal spiegeln<br>{settings.sensFloorConfig.flipX ? 'Ja' : 'Nein'}"
                icon={flipHorizontalIcon}
                alt="Ein Pfeil, der nach links und rechts zeigt"
                onClick={flipHorizontal}
            />
        </div>
    </div>

    <BackButton slug="/admin" />
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .sensfloor-alignment-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .sensfloor-alignment-button-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 20px;
    }

    .sensfloor-alignment-visuals-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 30px;
    }
</style>
