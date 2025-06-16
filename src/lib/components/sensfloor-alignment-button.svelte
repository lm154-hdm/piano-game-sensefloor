<script lang="ts">
    let { text, icon, alt, onClick } = $props();
</script>

<div class="sensfloor-alignment-button">
    <button onclick={onClick}>
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
        width: 50px;
        height: 50px;
    }

    img {
        width: 100%;
        height: 100%;
    }
</style>
