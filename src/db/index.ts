import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/rfid',
});

// Create Drizzle instance
export const db = drizzle(pool);

// Export for potential direct pool access
export { pool };
