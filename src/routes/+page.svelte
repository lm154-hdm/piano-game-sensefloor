<script lang="ts">
  import socket from "$lib/backend/socket"
  import { onMount } from "svelte"

  onMount(() => {
    socket.on("connect", () => {
      console.log("connected")
    })
  })

</script>