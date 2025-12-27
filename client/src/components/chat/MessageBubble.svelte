<script lang="ts">
  import type { Message } from "../../utils/types";
  import AgentAvatar from "../icons/AgentAvatar.svelte";
  import UserAvatar from "../icons/UserAvatar.svelte";

  interface Props {
    message: Message;
  }

  let { message }: Props = $props();

  const isAgent = $derived(
    message.role === "assistant" || message.role === "system"
  );
  const isUser = $derived(message.role === "user");

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
</script>

<div class="message message-{isAgent ? 'agent' : 'user'}">
  {#if isAgent}
    <div class="avatar avatar-agent">
      <AgentAvatar size={20} />
    </div>
  {/if}
  <div class="message-content">
    <div class="message-text">{message.content}</div>
    <div class="message-time">
      <time datetime={message.createdAt}>
        {formatTime(message.createdAt)}
      </time>
    </div>
  </div>
  {#if isUser}
    <div class="avatar avatar-user">
      <UserAvatar size={20} />
    </div>
  {/if}
</div>

<style>
  .message {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    max-width: 75%;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-user {
    align-self: flex-end;
    margin-left: auto;
  }

  .message-agent {
    align-self: flex-start;
  }

  .avatar {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
  }
  .avatar-user {
    background: var(--user-avatar-bg);
    color: var(--user-avatar-color);
    box-shadow: var(--shadow-md);
  }

  .avatar-agent {
    background: var(--agent-avatar-bg);
    color: var(--agent-avatar-color);
    box-shadow: var(--shadow-md);
  }

  .message-content {
    padding: 0.875rem 1.125rem;
    border-radius: 1.125rem;
    position: relative;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s ease;
  }

  .message-content:hover {
    box-shadow: var(--shadow-md);
  }

  .message-user .message-content {
    background: var(--user-message-bg);
    color: var(--user-message-text);
    border-bottom-right-radius: 0.25rem;
    box-shadow: var(--shadow-md);
  }

  .message-agent .message-content {
    background: var(--agent-message-bg);
    color: var(--agent-message-text);
    border-bottom-left-radius: 0.25rem;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
  }

  .message-text {
    word-wrap: break-word;
    line-height: 1.5;
  }

  .message-time {
    font-size: 0.75rem;
    opacity: 0.75;
    margin-top: 0.375rem;
    font-weight: 400;
  }

  .message-user .message-time {
    opacity: 0.9;
  }
</style>
