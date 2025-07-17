<script lang="ts">
    let { children } = $props();
</script>

<div class="labelled-settings-column">
    {@render children()}
</div>

<style>
    .labelled-settings-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
    }
</style>
