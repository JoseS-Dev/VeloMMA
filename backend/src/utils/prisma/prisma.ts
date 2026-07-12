import { PrismaClient } from "../../../generated/prisma/client.js";
import { middlewarePrismaMetrics } from "../../middlewares/metrics/database/prisma.middleware.js";
import { settings } from "../../../config/settings.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
    connectionString: settings.databaseUrl,
})

// Instancio la conexión a la base de datos
export const prismaRaw = new PrismaClient({
    adapter: new PrismaPg(pool),
});

const prismaWithSoftDelete = prismaRaw.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        args.where = args.where || {};
        if (args.where.deleted_at === undefined) args.where.deleted_at = null;
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = args.where || {};
        if (args.where.deleted_at === undefined) args.where.deleted_at = null;
        return query(args);
      },
      async findUnique({ args, query }) {
        args.where = args.where || {};
        if (args.where.deleted_at === undefined) args.where.deleted_at = null;
        return query(args);
      },
    },
  },
});

export type ExtendedPrismaClient = typeof prismaWithSoftDelete;
export const prisma = settings.nodeEnv === 'test' ? prismaRaw : middlewarePrismaMetrics(prismaWithSoftDelete);
