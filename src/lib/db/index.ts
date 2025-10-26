import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Please configure the environment variable.");
}

const createClient = () => {
  // For Neon pooler endpoint, use prepare: false
  // This disables prepared statements but ensures compatibility
  return postgres(connectionString, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: 'require',
  });
};

type DrizzleDb = PostgresJsDatabase<typeof schema>;

declare global {
  var __db__: DrizzleDb | undefined;
  var __sql__: ReturnType<typeof postgres> | undefined;
}

const sql = globalThis.__sql__ ?? createClient();
const db: DrizzleDb = globalThis.__db__ ?? drizzle(sql, { schema });

if (process.env.NODE_ENV !== "production") {
  globalThis.__sql__ = sql;
  globalThis.__db__ = db;
}

export { db, sql };
