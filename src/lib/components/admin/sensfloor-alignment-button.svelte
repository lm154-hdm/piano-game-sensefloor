<script lang="ts">
    interface SensFloorAlignmentButtonProps {
        text: string;
        icon: any;
        alt: string;
        onClick: () => void;
    }

    let { text, icon, alt, onClick }: SensFloorAlignmentButtonProps = $props();
</script>

<div class="sensfloor-alignment-button">
    <button class="menu-button primary-button" onclick={onClick}>
        <img src={icon} {alt} />
    </button>
    <div class="sensfloor-alignment-button-text">
        {@html text}
    </div>
</div>

<style>
    .sensfloor-alignment-button {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .sensfloor-alignment-button-text {
        text-align: center;
    }

    button {
        width: 65px;
        height: 65px;
        padding: 5px;
        margin-bottom: 10px;
    }

    img {
        width: 100%;
        height: 100%;
    }
</style>
