import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

const Page = async () => {
  const session = (await getServerSession(authOptions)) as Session;

  if (!session || !session?.user) redirect("/");

  return <Dashboard />;
};

export default Page;
