import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { config } from '../../config/index.js';

const adapter = new PrismaBetterSqlite3({ url: config.DATABASE_URL });
export const db = new PrismaClient({ adapter });
