import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from '../../config/index.js';

// PostgreSQL adapter for production (Render.com) and local development
// Note: The Prisma schema is configured for PostgreSQL.
// For local development, use a local PostgreSQL instance or Docker.
const pool = new Pool({ connectionString: config.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const db = new PrismaClient({ adapter });
