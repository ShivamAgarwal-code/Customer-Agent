# Local PostgreSQL Setup

Since we've migrated to PostgreSQL, you need to set up a local PostgreSQL database.

## Quick Setup with Docker (Recommended)

1. **Start PostgreSQL in Docker:**
   ```bash
   docker run --name customer-agent-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=customer_agent -p 5432:5432 -d postgres
   ```

2. **Update your `.env` file in the `server` directory:**
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/customer_agent
   ```

3. **Run migrations:**
   ```bash
   cd server
   npm run db:migrate
   ```

4. **That's it!** Your database is ready.

## If Docker container already exists

If you've run the command before and the container exists:

```bash
# Start existing container
docker start customer-agent-postgres

# Or remove and recreate
docker rm -f customer-agent-postgres
docker run --name customer-agent-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=customer_agent -p 5432:5432 -d postgres
```

## Alternative: Local PostgreSQL Installation

If you have PostgreSQL installed locally:

1. **Create the database:**
   ```bash
   createdb customer_agent
   ```

2. **Update your `.env` file:**
   ```env
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/customer_agent
   ```
   (Replace `your_username` and `your_password` with your PostgreSQL credentials)

3. **Run migrations:**
   ```bash
   cd server
   npm run db:migrate
   ```

## Verify Setup

After setting up, test the connection:

```bash
cd server
npm run db:studio
```

This should open Prisma Studio and show your database.

