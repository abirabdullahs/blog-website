// db-test.ts
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL!);

async function testConnection() {
  try {
    const result = await sql`SELECT version()`;
    console.log("✅ Neon Connected Successfully!", result[0]);
  } catch (error) {
    console.error("❌ Connection Failed:", error);
  }
}

testConnection();