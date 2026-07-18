import type { FlatPagination } from "../../common/decorator/decorator.ts";

declare global {
  namespace Express {
    interface Request {
      pagination?: FlatPagination;
    }
  }
}