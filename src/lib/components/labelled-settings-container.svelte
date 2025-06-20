<script lang="ts">
    const { text, children }: { text: string; children: any } = $props();
</script>

<div class="labelled-settings-container">
    <h2>{text}</h2>
    <div class="labelled-settings-button-container">
        {@render children()}
    </div>
</div>

<style>
    .labelled-settings-container {
        color: var(--text);
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .labelled-settings-button-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>
