<script lang="ts">
    interface LabelledSettingsContainerProps {
        text: string;
        children: any;
    }

    let { text, children }: LabelledSettingsContainerProps = $props();
</script>

<div class="labelled-settings-container">
    <h2>{text}</h2>
    {@render children()}
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
</style>
