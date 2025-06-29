<script lang="ts">
    interface StatusCardProps {
        buttonText: string;
        buttonClick: () => void;
        children?: any;
    }

    import icon from "$lib/assets/error.svg";

    let { buttonText, buttonClick, children }: StatusCardProps = $props();
</script>

<div class="flex-center flex-column">
    <img src={icon} alt="An exclamation mark in a circle, which indicates and error" />
    {@render children()}
    <button class="primary-button" onclick={buttonClick}>{buttonText}</button>
</div>

<style>
    img {
        width: 5vw;
        height: auto;
        fill: var(--false-note);
        stroke: var(--false-note);
    }

    button {
        padding: 5px;
    }
</style>
