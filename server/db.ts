import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let poolInstance: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function initializeDatabase() {
  if (!poolInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
      );
    }
    poolInstance = new Pool({ connectionString: process.env.DATABASE_URL });
    dbInstance = drizzle({ client: poolInstance, schema });
  }
  return { pool: poolInstance, db: dbInstance! };
}

// Use getter to defer initialization until first access
let initialized = false;
export const pool = new Proxy({} as Pool, {
  get(target, prop) {
    if (!initialized) {
      const result = initializeDatabase();
      initialized = true;
      return result.pool[prop as keyof Pool];
    }
    return poolInstance![prop as keyof Pool];
  }
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    if (!initialized) {
      const result = initializeDatabase();
      initialized = true;
      return result.db[prop as keyof ReturnType<typeof drizzle>];
    }
    return dbInstance![prop as keyof ReturnType<typeof drizzle>];
  }
});
