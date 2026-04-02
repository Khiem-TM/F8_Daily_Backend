import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any) as any;

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test_${Date.now()}@example.com`,
        password: "password123"
      }
    });
    console.log("USER_ID=" + user.id);
  } catch (e) {
    console.error(e);
  }
}
main();
