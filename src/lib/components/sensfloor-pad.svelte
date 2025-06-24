<script lang="ts">
    interface SensFloorPadProps {
        isHighlighted: boolean;
    }

    let { isHighlighted }: SensFloorPadProps = $props();
</script>

<div class="sensfloor-display-pad" style={isHighlighted ? ".sensfloor-display-pad-highlighted" : ""}></div>

<style>
    .sensfloor-display-pad {
        outline: 2px solid;
    }

    :global(.sensfloor-display-pad-highlighted) {
        background-color: red;
    }
</style>
