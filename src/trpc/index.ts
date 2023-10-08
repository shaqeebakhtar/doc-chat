import { authRouter } from "./auth";
import { fileRouter } from "./file";
import { paymentRouter } from "./payment";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  file: fileRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
