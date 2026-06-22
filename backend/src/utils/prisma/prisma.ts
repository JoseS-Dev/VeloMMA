import { PrismaClient } from "../../../generated/prisma/client.js";
import { settings } from "../../../config/settings.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
    connectionString: settings.databaseUrl,
})

// Instancio la conexión a la base de datos
export const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
});