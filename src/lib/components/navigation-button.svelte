<script lang="ts">
    interface NavigationButtonProps {
        text: string;
        slug: string;
    }

    let { text, slug }: NavigationButtonProps = $props();
</script>

<a class="menu-button secondary-button" href={slug}>{text}</a>

<style>
    a {
        width: var(--button-width);
        height: var(--button-width);
    }
</style>
