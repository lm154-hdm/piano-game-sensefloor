<script lang="ts">
    interface TitleProps {
        text: string;
    }

    let { text }: TitleProps = $props();
</script>

<div class="title-container">
    <h1>{text}</h1>
</div>

<style>
    .title-container {
        color: var(--text);
        position: absolute;
        top: 20px;
        left: 0px;
        width: 100%;
        text-align: center;
    }
</style>
