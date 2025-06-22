<script lang="ts">
    interface NavigationButtonProps {
        text: string;
        slug: string;
    }

    let { text, slug }: NavigationButtonProps = $props();
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
