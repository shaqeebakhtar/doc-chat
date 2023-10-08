import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import SignInLink from "./SignInLink";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>DocChat</span>
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Pricing
                </Link>
                <SignInLink />
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>

                <UserAccountNav
                  name={!user.name ? "Your Account" : `${user.name}`}
                  email={user.email ?? ""}
                  imageUrl={user.image ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
