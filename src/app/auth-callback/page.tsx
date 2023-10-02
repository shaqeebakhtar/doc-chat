"use client";

import { useRouter } from "next/navigation";
import { trpc } from "../_trpc/client";

type DashboardProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const Page = ({ searchParams }: DashboardProps) => {
  const router = useRouter();

  trpc.auth.callback.useQuery(undefined, {
    onSuccess: ({ user }) => {
      if (user) router.push(origin ? `/${searchParams?.origin}` : "/dashboard");
    },
  });

  return (
    <div className="w-full mt-24 flex justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
