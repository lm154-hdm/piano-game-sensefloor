<script lang="ts">
    import { save } from "$lib/backend/settings.svelte";
    import { beforeNavigate } from '$app/navigation';

    interface BackButtonProps {
        text: string;
        slug: string;
        shouldSave?: boolean;
    }

    let { text, slug, shouldSave = false }: BackButtonProps = $props();

    beforeNavigate(async () => {
        if (shouldSave) {
            await save();
        }
    });
</script>

<a class="menu-button primary-button bottom-right-corner" href={slug}>
    {text}
</a>
