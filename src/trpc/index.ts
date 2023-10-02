import { authRouter } from "./auth";
import { fileRouter } from "./file";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  file: fileRouter,
});

export type AppRouter = typeof appRouter;
