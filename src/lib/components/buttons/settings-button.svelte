<script lang="ts">
    import menuSoundPlayer from "$lib/backend/menu-sound-player";

    interface SettingsButtonProps {
        label?: string,
        details?: string
        onClick?: () => void;
        reset?: boolean
    }

    let { label, details, onClick, reset = false }: SettingsButtonProps = $props();
    let buttonElement: HTMLButtonElement;

    function clickMenuButton() {
        buttonElement.classList.add("active");
        setTimeout(() => {
            buttonElement.classList.remove("active");
        }, 250)
        menuSoundPlayer.start();
        if (onClick) {
            onClick();
        }
    }

</script>

<button
        bind:this={buttonElement}
        aria-label={label}
        class={`menu-button secondary-button ${reset ? 'bottom-left-corner' : ''}`}
        onclick={clickMenuButton}
>
    {#if reset}
        Zurücksetzen
    {:else}
        {label}
    {/if}
    {#if details}
        <br />{details}
    {/if}
</button>
