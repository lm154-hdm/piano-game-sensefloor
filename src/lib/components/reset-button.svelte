<script lang="ts">
    let { text, onClick } = $props();
</script>

<button
        class="menu-button secondary-button bottom-left-corner"
        onclick={onClick}>
    Zurücksetzen<br/>{text}
</button>/