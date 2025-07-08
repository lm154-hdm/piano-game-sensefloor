<script lang="ts">
    interface primaryNavigationButtonProps {
        text: string;
        slug: string;
    }

    let { text, slug }: primaryNavigationButtonProps = $props();
</script>

<a href={slug}>
    <button class="menu-button primary-button">{text}</button>
</a>

<style>
    a {
        width: var(--button-width);
        height: var(--button-width);
    }
</style>
