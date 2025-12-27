<script lang="ts">
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import { fetchConversations } from "../services/api";
  import type { ConversationsResult, Conversation } from "../utils/types";
  import { queryKeys } from "../utils/constants";
  import {
    activeConversationId,
    handleSelectConversation,
    handleNewConversation,
  } from "../stores/chatStore";
  import { goto } from "$app/navigation";
  import PlusIcon from "./icons/PlusIcon.svelte";

  function onSelectConversation(conversationId: string) {
    handleSelectConversation(conversationId);
    goto(`/chat/${conversationId}`);
  }

  function onNewConversation() {
    handleNewConversation();
    goto("/");
  }

  const conversationsQuery = createInfiniteQuery<
    ConversationsResult,
    Error,
    { pages: ConversationsResult[]; pageParams: (string | undefined)[] },
    readonly string[],
    string | undefined
  >(() => ({
    queryKey: queryKeys.conversations,
    queryFn: ({ pageParam }) => fetchConversations(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
  }));
  const allConversations = $derived(() =>
    conversationsQuery.data
      ? conversationsQuery.data.pages.flatMap((p) => p.conversations)
      : []
  );
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  }

  function getConversationTitle(conversation: Conversation): string {
    const date = new Date(conversation.createdAt);
    if (conversation.title && conversation.title.length > 0) {
      return conversation.title;
    }
    return `Conversation ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
  }

  function loadMore() {
    if (
      conversationsQuery.hasNextPage &&
      !conversationsQuery.isFetchingNextPage
    ) {
      conversationsQuery.fetchNextPage();
    }
  }
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <h2>Support Tickets</h2>
    <button
      class="new-ticket-btn"
      onclick={onNewConversation}
      aria-label="Create new ticket"
    >
      <PlusIcon size={20} />
    </button>
  </div>

  <div class="ticket-list">
    {#if conversationsQuery.status === "pending"}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading conversations...</p>
      </div>
    {:else if conversationsQuery.isError}
      <div class="error-state">
        <p>Failed to load conversations</p>
        <button class="retry-btn" onclick={() => conversationsQuery.refetch()}>
          Retry
        </button>
      </div>
    {:else if allConversations().length === 0}
      <div class="empty-state">
        <p>No tickets yet</p>
        <button class="start-btn" onclick={onNewConversation}
          >Start a conversation</button
        >
      </div>
    {:else}
      {#each allConversations() as conversation (conversation.id)}
        <button
          class="ticket-item"
          class:active={$activeConversationId === conversation.id}
          onclick={() => onSelectConversation(conversation.id)}
        >
          <div class="ticket-status">
            <span
              class="status-dot"
              class:open={conversation.status === "active"}
              class:closed={conversation.status === "closed"}
              aria-label={conversation.status === "active"
                ? "Active conversation"
                : "Closed conversation"}
            ></span>
          </div>
          <div class="ticket-info">
            <span class="ticket-title"
              >{getConversationTitle(conversation)}</span
            >
            <span class="ticket-date">{formatDate(conversation.updatedAt)}</span
            >
          </div>
        </button>
      {/each}

      {#if conversationsQuery.hasNextPage}
        <button
          class="load-more-btn"
          onclick={loadMore}
          disabled={conversationsQuery.isFetchingNextPage}
        >
          {#if conversationsQuery.isFetchingNextPage}
            <div class="spinner small"></div>
            Loading...
          {:else}
            Load more
          {/if}
        </button>
      {/if}
    {/if}
  </div>
</aside>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    width: 300px;
    min-width: 300px;
    height: 100vh;
    background: var(--bg-primary);
    border-right: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .sidebar-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .new-ticket-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
  }

  .new-ticket-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }

  .ticket-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    background: var(--bg-secondary);
  }

  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--text-secondary);
    padding: 20px;
  }

  .loading-state p,
  .error-state p,
  .empty-state p {
    margin: 0 0 12px 0;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 12px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .retry-btn,
  .start-btn {
    padding: 10px 20px;
    background: var(--primary-color);
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
  }

  .retry-btn:hover,
  .start-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .load-more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    margin-top: 8px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
  }

  .load-more-btn:hover:not(:disabled) {
    background: var(--primary-light);
    color: var(--primary-color);
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .load-more-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .spinner.small {
    width: 16px;
    height: 16px;
    margin-bottom: 0;
  }

  .ticket-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    padding: 14px;
    margin-bottom: 6px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
  }

  .ticket-item:hover {
    background: var(--bg-primary);
    border-color: var(--border-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .ticket-item.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-color: var(--primary-color);
    box-shadow: var(--shadow-md);
  }

  .ticket-status {
    display: flex;
    align-items: center;
    padding-top: 4px;
  }

  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .status-dot.open {
    background-color: var(--success-color);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
  }

  .status-dot.closed {
    background-color: var(--text-tertiary);
  }

  .ticket-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    flex: 1;
  }

  .ticket-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ticket-date {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 400;
  }
</style>
