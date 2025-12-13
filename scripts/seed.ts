import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

const envLocalPath = resolve(__dirname, "../.env.local");
const envPath = resolve(__dirname, "../.env");

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
} else if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.warn("Warning: No .env.local or .env file found");
}

import { db } from "../lib/db";
import { categories } from "../db/schema";

async function main() {
  try {
    await db
      .insert(categories)
      .values([
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Filming" },
      ]);
    console.log("Seeding finished.");
  } catch (error) {
    console.log("Error seeding the database categories", error);
    process.exit(1);
  }
}

main();
