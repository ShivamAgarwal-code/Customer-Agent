# Resetting Database Schema

Your Neon database has old tables (`TradeIntent`, `User`) that don't match your current schema (`Conversation`, `Message`).

## Option 1: Reset Database (Recommended for Development)

If this is a development/test database and you don't need the existing data:

```powershell
cd server
npx prisma migrate reset
```

This will:
- Drop all tables
- Run all migrations from scratch
- Seed the database (if you have seed scripts)

**Warning:** This will delete all data in the database!

## Option 2: Force Push Schema (Alternative)

If you want to sync the schema without using migrations:

```powershell
cd server
npx prisma db push --force-reset
```

This will:
- Drop all existing tables
- Create new tables matching your schema
- **Note:** This bypasses migrations, so use with caution

## Option 3: Manual Cleanup (If you need to preserve some data)

If you need to keep some data, you can manually drop the old tables:

1. Connect to your Neon database
2. Run these SQL commands:
   ```sql
   DROP TABLE IF EXISTS "TradeIntent" CASCADE;
   DROP TABLE IF EXISTS "User" CASCADE;
   ```
3. Then run migrations:
   ```powershell
   cd server
   npm run db:migrate
   ```

## After Resetting

Once the database is reset, verify it's working:

```powershell
cd server
npm run db:studio
```

This should show your `Conversation` and `Message` tables.

