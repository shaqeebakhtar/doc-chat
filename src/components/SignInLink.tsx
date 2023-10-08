"use client";

import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const SignInLink = () => {
  return (
    <Button onClick={() => signIn("google")} variant="ghost" size="sm">
      Sign in
    </Button>
  );
};

export default SignInLink;
