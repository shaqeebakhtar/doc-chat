import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PdfRenderer from "@/components/PdfRenderer";
import ChatWrapper from "@/components/chat/ChatWrapper";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

type PageProps = {
  params: {
    fileId: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const fileId = params?.fileId as string;

  const session = await getServerSession(authOptions);

  if (!session || !session.user) redirect("/");

  const file = await prisma.file.findUnique({
    where: {
      id_userId: {
        id: fileId,
        userId: session.user.id,
      },
    },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={file.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
