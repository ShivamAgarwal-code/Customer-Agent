<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { Sidebar } from "../components";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { QueryClient } from "@tanstack/svelte-query";
  import "../global.css"

  // Create QueryClient - works for both SSR and client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  });

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>
<QueryClientProvider client={queryClient}>
  <div class="app-layout">
    <Sidebar />
    <main class="page-content">
      {@render children()}
    </main>
  </div>
</QueryClientProvider>

<style>
  main {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    background: var(--bg-tertiary);
  }

  .app-layout {
    display: flex;
    height: 100vh;
    width: 100%;
    background: var(--bg-tertiary);
  }
  .page-content {
    flex: 1;
    overflow: auto;
    background: var(--bg-secondary);
  }
</style>
