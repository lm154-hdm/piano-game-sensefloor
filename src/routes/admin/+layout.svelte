<script lang="ts">
    import AdminSidebar from "$lib/components/admin/admin-sidebar.svelte";

    let { children } = $props();
</script>

<AdminSidebar />

<main class="stretch-screen flex-column admin-main">
    {@render children()}
</main>
