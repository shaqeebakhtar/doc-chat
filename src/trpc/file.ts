import prisma from "@/lib/db";
import { protectedProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

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

  delete: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const file = await prisma.file.findFirst({
        where: {
          id: input.fileId,
          userId,
        },
      });

      if (!file)
        throw new TRPCError({ message: "No such file", code: "NOT_FOUND" });

      return await prisma.file.delete({
        where: {
          id: input.fileId,
        },
      });
    }),
});
