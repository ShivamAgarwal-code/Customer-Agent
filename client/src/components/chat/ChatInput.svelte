<script lang="ts">
  import type { SendMessageInput } from "../../services/api/conversations";
  import SendIcon from "../icons/SendIcon.svelte";
  import SpinnerIcon from "../icons/SpinnerIcon.svelte";

  interface Props {
    disabled?: boolean;
    isLoading?: boolean;
    placeholder?: string;
    onSend: (input: SendMessageInput) => void;
    conversationId?: string;
  }

  let {
    disabled = false,
    isLoading = false,
    placeholder = "Type your message...",
    onSend,
    conversationId,
  }: Props = $props();

  let inputText = $state("");
  let inputElement: HTMLInputElement;

  function handleSend() {
    const trimmedText = inputText.trim();
    if (!trimmedText || disabled || isLoading) return;

    onSend({ message: trimmedText, conversationId });
    inputText = "";
    inputElement?.focus();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  $effect(() => {
    // Focus input when component mounts
    inputElement?.focus();
  });
</script>

<div class="input-container">
  <input
    type="text"
    {placeholder}
    bind:value={inputText}
    bind:this={inputElement}
    onkeydown={handleKeyDown}
    disabled={disabled || isLoading}
    class="message-input"
    aria-label="Message input"
  />
  <button
    class="send-button"
    onclick={handleSend}
    disabled={isLoading || !inputText.trim()}
    aria-label={isLoading ? "Sending message" : "Send message"}
  >
    {#if isLoading}
      <SpinnerIcon />
    {:else}
      <SendIcon />
    {/if}
  </button>
</div>

<style>
  .input-container {
    display: flex;
    gap: 0.875rem;
    padding: 1.25rem 1.75rem;
    border-top: 1px solid var(--border-color);
    background: var(--bg-primary);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }

  .message-input {
    flex: 1;
    padding: 0.875rem 1.25rem;
    border: 2px solid var(--border-color);
    border-radius: 1.5rem;
    font-size: 1rem;
    font-family: inherit;
    outline: none;
    transition: all 0.2s ease;
    background: var(--input-bg);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .message-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-light);
  }

  .message-input:disabled {
    background: var(--disabled-bg);
    cursor: not-allowed;
    opacity: 0.6;
    border-color: var(--border-color);
  }

  .send-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    flex-shrink: 0;
    box-shadow: var(--shadow-md);
  }

  .send-button:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: scale(1.08) translateY(-1px);
    box-shadow: var(--shadow-lg);
  }

  .send-button:active:not(:disabled) {
    transform: scale(0.95);
  }

  .send-button:disabled {
    background: var(--disabled-color);
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }
</style>
