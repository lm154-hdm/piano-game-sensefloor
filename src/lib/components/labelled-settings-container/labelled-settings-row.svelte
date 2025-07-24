<script lang="ts">
    let { children } = $props();
</script>

<div class="labelled-settings-row">
    {@render children()}
</div>

<style>
    .labelled-settings-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
    }
</style>
