<script lang="ts">
    import menuSoundPlayer from "$lib/backend/menu-sound-player";

    interface NavigationButtonProps {
        text: string;
        slug: string;
        classNames?: string;
    }

    let { text, slug, classNames = "secondary-button" }: NavigationButtonProps = $props();
    let anchorElement: HTMLAnchorElement;

    function clickEffect() {
        anchorElement.classList.add("active");
        setTimeout(() => {
            anchorElement.classList.remove("active");
        }, 250)
        menuSoundPlayer.start();
    }
</script>

<a class="menu-button {classNames}" href={slug} bind:this={anchorElement} onclick={clickEffect}>
    {text}
</a>
