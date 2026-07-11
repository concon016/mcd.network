// One-off: create the messages table.
// Usage: node scripts/migrate.js
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL missing — run `vercel env pull --yes` first.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const statements = schema.split(";").map((s) => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  console.log("Schema ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
