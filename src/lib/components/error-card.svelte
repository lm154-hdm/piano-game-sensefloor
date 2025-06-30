<script lang="ts">
    import icon from "$lib/assets/error.svg";

    let { children } = $props();
</script>

<div class="flex-center flex-column">
    <img src={icon} alt="An exclamation mark in a circle, which indicates and error" />
    {@render children()}
</div>

<style>
    img {
        width: auto;
        height: 5vh;
        fill: var(--false-note);
        stroke: var(--false-note);
    }
</style>
