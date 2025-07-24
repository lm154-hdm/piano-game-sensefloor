<script lang="ts">

    interface ResetButtonProps {
        text: string | undefined;
        onClick: () => void;
    }

    let { text, onClick }: ResetButtonProps = $props();
</script>

<button
        class="menu-button secondary-button bottom-left-corner"
        onclick={onClick}
>
    Zurücksetzen<br/>{text}
</button>/
