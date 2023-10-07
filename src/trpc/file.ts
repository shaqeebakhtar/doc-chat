import prisma from "@/lib/db";
import { protectedProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

export const fileRouter = router({
  getUserFiles: protectedProcedure.query(async ({ ctx }) => {
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

  getFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const file = await prisma.file.findFirst({
        where: {
          userId,
          key: input.key,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),

  getUploadStatus: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;

      const file = await prisma.file.findFirst({
        where: {
          id: input.fileId,
          userId,
        },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  getFileMessages: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;

      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await prisma.file.findFirst({
        where: {
          id: input.fileId,
          userId,
        },
      });

      if (!file)
        throw new TRPCError({ message: "No such file", code: "NOT_FOUND" });

      const messages = await prisma.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
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
