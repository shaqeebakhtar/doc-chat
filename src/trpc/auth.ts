import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { publicProcedure, router } from "./trpc";

export const authRouter = router({
  callback: publicProcedure.query(async () => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return { user: true };
  }),
});
