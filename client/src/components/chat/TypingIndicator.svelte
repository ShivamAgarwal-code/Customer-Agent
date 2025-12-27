<script lang="ts">
  interface Props {
    label?: string;
  }

  let { label = 'Agent is typing' }: Props = $props();
</script>

<div class="typing-wrapper" role="status" aria-label={label}>
  <div class="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>

<style>
  .typing-wrapper {
    padding: 0.875rem 1.125rem;
    border-radius: 1.125rem;
    border-bottom-left-radius: 0.25rem;
    background: var(--agent-message-bg);
    border: 1px solid var(--border-color);
    display: inline-block;
    box-shadow: var(--shadow-sm);
  }

  .typing-indicator {
    display: flex;
    gap: 0.375rem;
    padding: 0.25rem 0;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary-color);
    animation: typing 1.4s infinite;
    opacity: 0.6;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
</style>
