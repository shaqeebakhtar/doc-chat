"use client";

import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const LogoutLink = () => {
  return (
    <Button onClick={() => signOut()} variant="destructive" size="sm">
      Logout
    </Button>
  );
};

export default LogoutLink;
