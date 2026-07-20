import type { FlatPagination } from "../../common/decorator/decorator.ts";

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      contextStartTime?: number;
      pagination?: FlatPagination;
    }
  }
}