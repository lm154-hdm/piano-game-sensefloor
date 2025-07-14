<script lang="ts">
    interface primaryNavigationButtonProps {
        text: string;
        slug: string;
    }

    let { text, slug }: primaryNavigationButtonProps = $props();
</script>

<a class="menu-button primary-button" href={slug}>{text}</a>

<style>
    a {
        width: var(--button-width);
        height: var(--button-width);
    }
</style>
