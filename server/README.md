# Backend API

A customer support chat API built with Node.js, TypeScript, Express, and OpenAI.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Running Locally

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env  # if you have one, or create .env manually
   ```
   Add your `OPENAI_API_KEY` to the `.env` file (see Environment Variables below).

3. **Set up the database**
   
   **Option A: Use PostgreSQL (Recommended - matches production)**
   ```bash
   # Using Docker
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   
   # Set DATABASE_URL in .env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/customer_agent
   
   # Run migrations
   npm run db:migrate
   ```
   
   **Option B: Use a local PostgreSQL installation**
   - Install PostgreSQL on your system
   - Create a database: `createdb customer_agent`
   - Set `DATABASE_URL=postgresql://user:password@localhost:5432/customer_agent` in `.env`
   - Run migrations: `npm run db:migrate`

4. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```
   (This is also run automatically by the build script)

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000` by default.

### Database Setup

The project uses Prisma with PostgreSQL for both development and production. This ensures consistency between local and production environments.

**For Local Development:**
- Install PostgreSQL locally or use Docker:
  ```bash
  docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
  ```
- Set `DATABASE_URL=postgresql://postgres:password@localhost:5432/customer_agent` in your `.env`
- Run migrations: `npm run db:migrate`

**For Production:**
- Set `DATABASE_URL=postgresql://user:password@host:port/database` in your environment
- Migrations run automatically during deployment via `postbuild` script

**Migrations:**
- Run migrations: `npm run db:migrate` (development)
- Deploy migrations: `npm run db:migrate:deploy` (production)
- View/edit database: `npm run db:studio`

**Seeding:**
No seed scripts are included. You can add data manually via Prisma Studio or create seed scripts if needed.

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://postgres:password@localhost:5432/customer_agent

# Optional (defaults shown)
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info
CORS_ORIGIN=*
OPENAI_MODEL=gpt-5-mini
```

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key (get one from https://platform.openai.com)

**Optional:**
- `NODE_ENV` - Environment mode (development/production/test)
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `LOG_LEVEL` - Logging level (fatal/error/warn/info/debug/trace)
- `CORS_ORIGIN` - CORS allowed origins (default: *)
- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - Example (local): `postgresql://postgres:password@localhost:5432/customer_agent`
  - Example (Render): `postgresql://user:pass@dpg-xxx.render.com:5432/dbname`
- `OPENAI_MODEL` - OpenAI model to use (default: gpt-5-mini)

## Deployment

### Deploying to Render.com

1. **Create a PostgreSQL Database on Render**
   - Go to your Render dashboard
   - Create a new PostgreSQL database
   - Note the connection string (Internal Database URL)

2. **Create a Web Service**
   - Connect your GitHub repository
   - Set the following:
     - **Root Directory**: `server`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Set Environment Variables in Render Dashboard**
   ```
   NODE_ENV=production
   PORT=10000
   HOST=0.0.0.0
   LOG_LEVEL=info
   CORS_ORIGIN=https://your-frontend-domain.com
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-5-mini
   DATABASE_URL=<Internal Database URL from step 1>
   ```

4. **Alternative: Use render.yaml**
   - The repository includes a `render.yaml` file at the root
   - You can use it to deploy via Render's Blueprint feature
   - Make sure to set `CORS_ORIGIN` and `OPENAI_API_KEY` in the Render dashboard

**Note:** The application uses PostgreSQL for both development and production to ensure consistency. See `DEPLOYMENT.md` for detailed deployment instructions.

## Architecture

### Structure

The backend follows a layered architecture:

```
src/
├── config/          # Configuration and env validation
├── controllers/     # Request handlers (thin layer)
├── services/        # Business logic
├── repositories/    # Data access layer (Prisma)
├── integrations/    # External services (LLM, DB)
├── routes/          # Express route definitions
├── middleware/      # Express middleware (error handling, logging)
├── errors/          # Custom error classes
├── utils/           # Utilities (prompts, constants, logger)
└── types/           # TypeScript type definitions
```

**Flow:** Routes → Controllers → Services → Repositories → Database

### Design Decisions

**1. Service Context Pattern**
Services receive a `ServiceContext` object containing repositories and integrations (like LLM). This makes testing easier and keeps dependencies explicit.

**2. LLM Abstraction**
There's an `LLMIntegration` interface, so we can swap providers (OpenAI, Anthropic, etc.) without changing business logic. Currently only OpenAI is implemented.

**3. Request Classification**
Before calling the LLM, we first classify the request type (FAQ, PersonalInformation, Greeting, Other). This lets us skip LLM calls for greetings or handle special cases, saving API costs.

**4. Context Window Management**
Only the last 10 messages are sent to the LLM for context, but all messages are stored in the database. This balances context quality with token costs.

**5. Cursor-based Pagination**
List endpoints use cursor-based pagination instead of offset-based, which performs better at scale.

