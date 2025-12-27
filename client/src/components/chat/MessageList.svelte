<script lang="ts">
  import type { Message } from '../../utils/types';
  import MessageBubble from './MessageBubble.svelte';
  import TypingIndicator from './TypingIndicator.svelte';

  interface Props {
    messages: Message[];
    isTyping?: boolean;
  }

  let { messages, isTyping = false }: Props = $props();
  let containerElement: HTMLDivElement;

  function scrollToBottom() {
    if (containerElement) {
      containerElement.scrollTop = containerElement.scrollHeight;
    }
  }

  $effect(() => {
    if (messages.length > 0 || isTyping) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  });
</script>

<div class="messages-container" bind:this={containerElement} role="log" aria-live="polite">
  {#each messages as message (message.id)}
    <MessageBubble {message} />
  {/each}

  {#if isTyping}
    <div class="typing-container">
      <TypingIndicator />
    </div>
  {/if}
</div>

<style>
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 2rem 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    scroll-behavior: smooth;
    background: var(--bg-secondary);
  }

  .typing-container {
    align-self: flex-start;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .messages-container::-webkit-scrollbar {
    width: 10px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 5px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  .messages-container::-webkit-scrollbar-thumb:hover {
    background: var(--text-tertiary);
    background-clip: padding-box;
  }
</style>
