<script lang="ts">
  import Chat from "../../../components/Chat.svelte";
  const { data } = $props();
</script>

<Chat conversationId={data.conversationId} />

<style>
</style>
