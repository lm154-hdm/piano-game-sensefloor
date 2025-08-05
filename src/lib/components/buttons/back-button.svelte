<script lang="ts">
    import { save } from "$lib/backend/settings.svelte";
    import { beforeNavigate } from '$app/navigation';
    import menuSoundPlayer from "$lib/backend/menu-sound-player";

    interface BackButtonProps {
        text: string;
        slug: string;
        shouldSave?: boolean;
    }

    let { text, slug, shouldSave = false }: BackButtonProps = $props();
    let anchorElement: HTMLAnchorElement;

    beforeNavigate(async () => {
        if (shouldSave) {
            await save();
        }
    });

    function clickEffect() {
        anchorElement.classList.add("active");
        setTimeout(() => {
            anchorElement.classList.remove("active");
        }, 250)
        menuSoundPlayer.start();
    }
</script>

<a class="menu-button primary-button bottom-right-corner" href={slug} bind:this={anchorElement} onclick={clickEffect}>
    {text}
</a>
