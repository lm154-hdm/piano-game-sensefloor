<script lang="ts">
    const { text }: { text: string } = $props();
</script>

<div class="title-container">
    <h1>{text}</h1>
</div>

<style>
    .title-container {
        position: absolute;
        top: 20px;
        left: 0px;
        width: 100vw;
        text-align: center;
    }
</style>
