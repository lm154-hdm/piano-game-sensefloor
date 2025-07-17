<script lang="ts">
    interface NavigationButtonProps {
        text: string;
        slug: string;
        classNames?: string;
    }

    let { text, slug, classNames = "secondary-button" }: NavigationButtonProps = $props();
</script>

<a class="menu-button {classNames}" href={slug}>
    {text}
</a>
