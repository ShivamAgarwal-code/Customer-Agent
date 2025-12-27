## Getting Started

To run this project, you have two options:

### With Docker Compose

```bash
docker compose up
```

### Without Docker Compose

You need to start both the backend and frontend services:

1. **Start the Backend** - Follow the instructions in [backend/README.md](./backend/README.md)
2. **Start the Frontend** - Follow the instructions in [frontend/README.md](./frontend/README.md)

> **Note:** The backend must be running before starting the frontend, as the frontend connects to the backend API.

## LLM Integration

### Provider

Currently using **OpenAI** (configurable via `OPENAI_API_KEY` and `OPENAI_MODEL` env vars).

### Prompting Strategy

**System Prompt:**
A detailed system prompt defines the assistant as a StyleHub customer support agent, including FAQ information, policies, and instructions.

**Request Classification:**
- First, we classify the user's message type using a separate LLM call
- Based on classification, we either:
  - Return a default greeting (for greetings)
  - Call the full LLM with context (for FAQ questions)
  - Return a default "contact support" message (for personal info or unclear requests)

**Message Construction:**
- System prompt + conversation history (last 10 messages) + current user message
- Responses are capped at 500 completion tokens for consistency

### Trade-offs

**Why classify requests first?** Saves API costs by avoiding unnecessary LLM calls for greetings or out-of-scope questions. Trade-off is slightly higher latency for the classification step.

**Why only 10 messages?** Balances context quality with token costs. 10 messages usually provide enough context without hitting token limits or high costs.

**Why 500 token limit?** Keeps responses concise and consistent. Most customer support responses don't need longer outputs.

## If I Had More Time...

- **Testing:** Unit tests for services, integration tests for API endpoints, mock LLM responses
- **Rate Limiting:** Protect against abuse and manage API costs
- **Caching:** Cache common FAQ responses to reduce LLM calls
- **Streaming:** Stream LLM responses for better UX instead of waiting for complete responses
- **Conversation Status:** Currently status field exists but isn't used. Will provide option in UI so that user can mark the conversation as resolved.
- **Build Proper Workflow:** Currently we have very simple workflow- identify type and respond that is why it is contained in a function with if else block. In a proper agent, we should have a proper workflow system, defining actions at each step and choice. 
- **More meta in Conversation:** We can also add more fields for example: a field indicating where the ticket is: in dev, to a customer support human agent, etc and ai agent can decide where should this conversation go.
