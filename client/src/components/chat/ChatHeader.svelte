<script lang="ts">
  interface Props {
    title?: string;
    isOnline?: boolean;
  }

  let { title = 'Customer Support', isOnline = true }: Props = $props();
</script>

<header class="chat-header">
  <h2>{title}</h2>
  <div class="status-indicator">
    <span class="status-dot" class:online={isOnline} class:offline={!isOnline}></span>
    <span>{isOnline ? 'Online' : 'Offline'}</span>
  </div>
</header>

<style>
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.75rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-primary);
    box-shadow: var(--shadow-sm);
  }

  .chat-header h2 {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    padding: 6px 12px;
    background: var(--bg-secondary);
    border-radius: 20px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .status-dot.online {
    background: var(--success-color);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    animation: pulse 2s infinite;
  }

  .status-dot.offline {
    background: var(--error-color);
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
