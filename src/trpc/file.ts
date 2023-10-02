import prisma from "@/lib/db";
import { protectedProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

export const fileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;

    try {
      return await prisma.file.findMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      const message = (error as Error).message;
      throw new TRPCError({ message, code: "INTERNAL_SERVER_ERROR" });
    }
  }),
});
