# Frontend

A customer support chat interface built with SvelteKit and TypeScript.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Backend server running (see [../backend/README.md](../backend/README.md))

### Running Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Ensure the backend is running**
   The frontend expects the backend API to be available at `http://localhost:3000`. Make sure you've started the backend server first (see [../backend/README.md](../backend/README.md)).

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` by default (or another port if 5173 is in use).

4. **Open in browser**
   Navigate to the URL shown in the terminal, or use:
   ```bash
   npm run dev -- --open
   ```

### Building for Production

To create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Architecture

The frontend is built with:
- **SvelteKit** - Since we needed routing
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching and caching
- **Svelte 5** - Runes enabled

### Project Structure

```
src/
├── components/      # Reusable UI components (Chat, Sidebar, etc.)
├── routes/          # SvelteKit routes and pages
├── services/        # API service layer
├── stores/          # State management
└── utils/           # Utilities and types
```

### API Configuration

The frontend connects to the backend API at `http://localhost:3000` by default. This is configured in `src/services/api/conversations.ts`.
