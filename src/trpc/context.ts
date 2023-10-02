import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Session, getServerSession } from "next-auth";

export const createContext = async () => {
  const session = (await getServerSession(authOptions)) as Session;

  return {
    user: session?.user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
