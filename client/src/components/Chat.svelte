<script lang="ts">
  import ChatHeader from "./chat/ChatHeader.svelte";
  import MessageList from "./chat/MessageList.svelte";
  import ChatInput from "./chat/ChatInput.svelte";
  import {
    messages,
    isTyping,
    activeConversationId,
    handleNewConversation,
    createMessage,
    setNewMessage,
    setLoadedMessages,
  } from "../stores";
  import {
    createInfiniteQuery,
    createMutation,
    useQueryClient,
  } from "@tanstack/svelte-query";
  import {
    fetchMessages,
    sendMessage,
    type FetchMessageParams,
    type SendMessageInput,
  } from "../services/api/conversations";
  import { type MessagesResult } from "../utils/types";
  import { queryKeys } from "../utils/constants";
  import { goto } from "$app/navigation";
  const { conversationId } = $props();

  const queryClient = useQueryClient();

  // When conversationId changes, load messages or reset for new chat
  $effect(() => {
    const id = conversationId;

    if (id) {
      activeConversationId.set(id);
    } else {
      handleNewConversation();
    }
  });

  $effect(() => {
    if (loadMessagesQuery.data?.pages && conversationId) {
      const allMessages = loadMessagesQuery.data.pages.flatMap(
        (page) => page.messages
      );
      allMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      if (allMessages.length == 0) {
        goto("/");
      }
      setLoadedMessages(allMessages);
    }
  });

  const sendMessageMutation = createMutation(() => ({
    mutationFn: sendMessage,
    onMutate: async (variables: SendMessageInput) => {
      const userMessage = createMessage(
        variables.message,
        "user",
        conversationId
      );
      setNewMessage(userMessage);

      isTyping.set(true);
    },
    onSuccess: async (data, variables) => {
      const agentMessage = createMessage(
        data.response,
        "assistant",
        data.conversationId
      );
      setNewMessage(agentMessage);

      isTyping.set(false);

      if (data.conversationId && !conversationId) {
        goto(`/chat/${data.conversationId}`);
      }

      if (data.conversationId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.messages(data.conversationId),
        });
      }
    },
    onError: () => {
      isTyping.set(false);
    },
  }));

  const loadMessagesQuery = createInfiniteQuery<
    MessagesResult,
    Error,
    { pages: MessagesResult[]; pageParams: FetchMessageParams },
    readonly string[],
    FetchMessageParams
  >(() => ({
    queryKey: queryKeys.messages(conversationId),
    queryFn: ({ pageParam }) => fetchMessages(pageParam),

    initialPageParam: {
      conversationId: conversationId,
    },
    getNextPageParam: (lastPage) => ({
      conversationId: conversationId,
      nextCursor: lastPage.meta.hasMore
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
    }),
    enabled: !!conversationId,
  }));
</script>

<div class="chat-container">
  <ChatHeader
    title="Customer Support"
    isOnline={!sendMessageMutation.isPending}
  />
  <div class="chat-content">
    {#if conversationId && loadMessagesQuery.isPending}
      <div class="loading-messages">
        <div class="spinner"></div>
        <p>Loading messages...</p>
      </div>
    {:else}
      <MessageList messages={$messages} isTyping={$isTyping} />
    {/if}
    <ChatInput
      onSend={sendMessageMutation.mutate}
      isLoading={sendMessageMutation.isPending ||
        (conversationId && loadMessagesQuery.isPending)}
      {conversationId}
    />
  </div>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .chat-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    background: var(--bg-secondary);
  }
  .loading-messages {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: var(--text-secondary);
  }
  .loading-messages p {
    margin: 16px 0 0 0;
    font-size: 0.95rem;
    font-weight: 500;
  }
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
