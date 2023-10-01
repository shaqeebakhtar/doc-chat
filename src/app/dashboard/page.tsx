import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = (await getServerSession(authOptions)) as Session;

  if (!session || !session?.user) redirect("/auth-callback?origin=dashboard");

  return <div>{session?.user.email}</div>;
};

export default Page;
